import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async create(
    createCardInput: CreateCardInput,
    boardId: string,
    userId: string,
  ) {
    const list = await this.prisma.list.findFirst({
      where: { id: createCardInput.listId, boardId },
    });
    if (!list) throw new BadRequestException('Invalid List ');
    const lastCard = await this.prisma.card.findFirst({
      where: {
        listId: createCardInput.listId,
      },
      orderBy: {
        orderIndex: 'desc',
      },
    });

    const newCard = await this.prisma.card.create({
      data: {
        title: createCardInput.title,
        listId: createCardInput.listId,
        userId,
        orderIndex: lastCard ? lastCard.orderIndex + 1 : 0,
      },
    });

    await this.activityService.create(
      {
        listId: list.id,
        cardId: newCard.id,
        action: `created card "${newCard.title}" in list "${list.name}"`,
      },
      userId,
    );

    return newCard;
  }

  findAll() {
    return `This action returns all card`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  async findByListId(listId: string) {
    return await this.prisma.card.findMany({
      where: {
        listId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.card.findUnique({
      where: { id },
      include: {
        checklists: {
          include: {
            items: true,
          },
        },
        activities: {
          include: {
            user: true,
          },
        },
        assignMembers: {
          include: {
            user: true,
          },
        },
        attachments: {
          include: {
            media: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(id: string, updateCardInput: UpdateCardInput) {
    const updatedCard = await this.prisma.card.update({
      where: {
        id,
      },
      data: {
        ...updateCardInput,
      },
    });

    return updatedCard;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
