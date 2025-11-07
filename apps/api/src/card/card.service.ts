import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  private async logActivity(
    condition: boolean,
    action: string,
    cardId: string,
    userId: string,
  ) {
    if (condition) {
      await this.activityService.create({ action, cardId }, userId);
    }
  }

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

  async getBoardIdFromCard(cardId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card id');
    return card.list.boardId;
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
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        checklists: {
          include: {
            items: {
              include: {
                assignMembers: true,
              },
            },
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
      },
    });
    if (!card) throw new NotFoundException('No Card found!');

    return card;
  }

  async update(id: string, updateCardInput: UpdateCardInput, userId: string) {
    const oldCard = await this.prisma.card.findUnique({ where: { id } });
    if (!oldCard) throw new BadRequestException('No card found.');
    const updatedCard = await this.prisma.card.update({
      where: {
        id,
      },
      data: {
        ...updateCardInput,
      },
    });

    await this.logActivity(
      updateCardInput.isCompleted !== null &&
        typeof updateCardInput.isCompleted !== 'undefined',
      updateCardInput.isCompleted ? 'marked completed' : 'unmarked completed',
      id,

      userId,
    );

    await this.logActivity(
      updateCardInput.title !== oldCard.title &&
        typeof updateCardInput.title !== 'undefined' &&
        updateCardInput.title !== null,
      `changed title "${oldCard.title}" -> "${updateCardInput.title}"`,
      id,

      userId,
    );

    await this.logActivity(
      updateCardInput.description !== null &&
        typeof updateCardInput.description !== 'undefined' &&
        updateCardInput.description !== oldCard.description,
      `updated description`,
      id,
      userId,
    );

    await this.logActivity(
      updateCardInput.priority !== null &&
        typeof updateCardInput.priority !== 'undefined' &&
        updateCardInput.priority !== oldCard.priority,
      `changed priority to "${updateCardInput.priority}"`,
      id,
      userId,
    );

    await this.logActivity(
      (updateCardInput.dueDate != null &&
        updateCardInput.dueDate !== oldCard.dueDate) ||
        (updateCardInput.startDate != null &&
          updateCardInput.startDate !== oldCard.startDate),
      'updated date',
      id,
      userId,
    );

    return updatedCard;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
