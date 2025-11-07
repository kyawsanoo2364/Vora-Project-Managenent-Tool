import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createActivityInput: CreateActivityInput, userId: string) {
    const newActivity = await this.prisma.activity.create({
      data: { ...createActivityInput, userId },
    });

    return newActivity;
  }

  async findAllByCardId(cardId: string, boardId: string) {
    const existingCard = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!existingCard) throw new BadRequestException('Invalid card or cardId');
    if (existingCard.list.boardId !== boardId)
      throw new BadRequestException('Invalid card or board');
    return await this.prisma.activity.findMany({
      where: {
        cardId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityInput: UpdateActivityInput) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
