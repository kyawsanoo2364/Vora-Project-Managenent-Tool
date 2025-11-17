import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
