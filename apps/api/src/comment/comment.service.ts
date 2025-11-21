import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReplyCommentInput } from './dto/create-reply-comment.input';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { paginateQuery } from 'src/common/pagination/pagination.helper';
import { Comment } from './entities/comment.entity';
import { ReplyComment } from './entities/reply-comment.entity';
import { ReactionToCommentService } from 'src/reaction-to-comment/reaction-to-comment.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reactionToCommentService: ReactionToCommentService,
  ) {}

  async create(
    createCommentInput: CreateCommentInput,
    boardId: string,
    userId: string,
  ) {
    const { content, cardId } = createCommentInput;
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        list: {
          boardId,
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid Card or Board');
    const newComment = await this.prisma.comment.create({
      data: {
        content,
        cardId,
        userId,
      },
      include: {
        user: true,
      },
    });

    return newComment;
  }

  async createReplyComment(
    createCommentInput: CreateReplyCommentInput,
    boardId: string,
    userId: string,
  ) {
    const { content, replyToId } = createCommentInput;
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: replyToId,
        card: {
          list: {
            boardId,
          },
        },
      },
    });
    if (!comment) throw new BadRequestException('Invalid comment or board');
    const newReply = await this.prisma.replyComment.create({
      data: {
        content,
        userId,
        replyToId,
      },
    });

    return newReply;
  }

  async findAll(
    cardId: string,
    boardId: string,
    paginationArgs: PaginationArgs,
    userId: string,
  ) {
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        list: {
          boardId,
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card or board');

    const data = await paginateQuery<Comment>(
      this.prisma,
      this.prisma.comment,
      {
        cursor: paginationArgs.cursor,
        take: paginationArgs.take,
        where: {
          cardId,
        },
        include: {
          user: true,
          reactions: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    );

    data.items = await Promise.all(
      data.items.map(async (i) => {
        const reactions = await this.reactionToCommentService.findAll(
          i.id,
          userId,
        );
        return { ...i, reactions } as any;
      }),
    );

    return data;
  }

  async findAllReplies(
    commentId: string,
    boardId: string,
    paginationArgs: PaginationArgs,
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        card: {
          list: {
            boardId,
          },
        },
      },
    });
    if (!comment) throw new BadRequestException('Invalid comment or board');

    const data = await paginateQuery<ReplyComment>(
      this.prisma,
      this.prisma.replyComment,
      {
        cursor: paginationArgs.cursor,
        take: paginationArgs.take,
        where: {
          replyToId: commentId,
        },
        include: {
          user: true,
        },
      },
    );

    return data;
  }

  async updateComment(
    id: string,
    updateCommentInput: UpdateCommentInput,
    boardId: string,
    userId: string,
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id,
        card: {
          list: {
            boardId,
          },
        },
      },
    });

    if (!comment) throw new BadRequestException('Invalid Comment');
    if (comment.userId !== userId)
      throw new ForbiddenException(
        'Access denied: You can only update comments that you own.',
      );
    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: {
        content: updateCommentInput.content,
      },
      include: {
        user: true,
      },
    });

    return updatedComment;
  }

  async updateReplyComment(
    id: string,
    updateReplyCommentInput: UpdateCommentInput,
    boardId: string,
    userId: string,
  ) {
    const replyComment = await this.prisma.replyComment.findFirst({
      where: {
        id,
        replyTo: {
          card: {
            list: {
              boardId,
            },
          },
        },
      },
    });

    if (!replyComment) throw new BadRequestException('Invalid Comment');
    if (replyComment.userId !== userId)
      throw new ForbiddenException(
        'Access denied: You can only update comments that you own.',
      );
    const updatedReplyComment = await this.prisma.replyComment.update({
      where: { id },
      data: {
        content: updateReplyCommentInput.content,
      },
      include: {
        user: true,
      },
    });

    return updatedReplyComment;
  }

  async removeComment(id: string, userId: string, boardId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id,
        card: {
          list: {
            boardId,
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!comment) throw new BadRequestException('Invalid Comment or board');
    const boardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userId,
      },
      select: {
        role: true,
      },
    });
    if (!boardMember)
      throw new UnauthorizedException('You are not a member of this board.');

    if (comment.userId !== userId && boardMember.role !== 'ADMIN')
      throw new ForbiddenException(
        'You do not have permission to delete this comment.',
      );
    const deletedComment = await this.prisma.comment.delete({ where: { id } });
    return deletedComment;
  }

  async removeReplyComment(id: string, userId: string, boardId: string) {
    const comment = await this.prisma.replyComment.findFirst({
      where: {
        id,
        replyTo: {
          card: {
            list: {
              boardId,
            },
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!comment) throw new BadRequestException('Invalid Comment or board');
    const boardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userId,
      },
      select: {
        role: true,
      },
    });
    if (!boardMember)
      throw new UnauthorizedException('You are not a member of this board.');

    if (comment.userId !== userId && boardMember.role !== 'ADMIN')
      throw new ForbiddenException(
        'You do not have permission to delete this comment.',
      );
    const deletedComment = await this.prisma.replyComment.delete({
      where: { id },
    });
    return deletedComment;
  }
}
