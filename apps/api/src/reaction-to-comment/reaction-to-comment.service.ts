import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateReactionToCommentInput } from './dto/create-reaction-to-comment.input';
import { UpdateReactionToCommentInput } from './dto/update-reaction-to-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionToCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(commentId: string, userId: string) {
    const reactionsGroup = await this.prisma.reactionToComment.groupBy({
      where: {
        commentId,
      },
      by: 'emoji',

      _count: {
        emoji: true,
      },
    });

    const reactionList = await this.prisma.reactionToComment.findMany({
      where: {
        commentId,
      },
      select: {
        id: true,
        userId: true,
        emoji: true,
      },
    });

    const userMap = reactionList.reduce(
      (acc, r) => {
        if (!acc[r.emoji]) acc[r.emoji] = [];
        acc[r.emoji].push(r.userId);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return reactionsGroup.map((r) => ({
      emoji: r.emoji,
      count: r._count.emoji,
      _count: undefined,
      users: userMap[r.emoji] || [],
      reactedByUser: userMap[r.emoji]?.includes(userId) || false,
    }));
  }

  //add react or remove react
  async create(
    createReactionToCommentInput: CreateReactionToCommentInput,
    boardId: string,
    userId: string,
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: createReactionToCommentInput.commentId,
        card: {
          list: {
            boardId,
          },
        },
      },
    });
    if (!comment) throw new BadRequestException('Invalid comment or board');
    const existingReaction = await this.prisma.reactionToComment.findFirst({
      where: {
        commentId: createReactionToCommentInput.commentId,
        userId,
      },
    });
    if (existingReaction) {
      const removedReaction = await this.remove(
        existingReaction.id,
        boardId,
        userId,
      );
      if (existingReaction.emoji === createReactionToCommentInput.emoji)
        return removedReaction;
    }
    const newReaction = await this.prisma.reactionToComment.create({
      data: {
        emoji: createReactionToCommentInput.emoji,
        commentId: createReactionToCommentInput.commentId,
        userId,
      },
    });

    return newReaction;
  }

  //remove react
  async remove(id: string, boardId: string, userId: string) {
    const reaction = await this.prisma.reactionToComment.findUnique({
      where: {
        id,
        comment: {
          card: {
            list: {
              boardId,
            },
          },
        },
      },
    });
    if (!reaction) throw new BadRequestException('Invalid reaction or board');
    if (reaction.userId !== userId)
      throw new ForbiddenException(
        'Access denied. You are not the owner of this reaction.',
      );
    const removedReaction = await this.prisma.reactionToComment.delete({
      where: {
        id,
      },
    });
    return removedReaction;
  }
}
