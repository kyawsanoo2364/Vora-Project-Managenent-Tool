import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createChecklistInput: CreateChecklistInput,
    userId: string,
    boardId: string,
  ) {
    const card = await this.prisma.card.findUnique({
      where: { id: createChecklistInput.cardId },
      include: {
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card');
    if (card.list.boardId !== boardId)
      throw new BadRequestException('Invalid card or board');
    const lastCheckList = await this.prisma.checklist.findFirst({
      where: {
        cardId: createChecklistInput.cardId,
      },
      orderBy: {
        orderIndex: 'desc',
      },
    });
    const newCheckList = await this.prisma.checklist.create({
      data: {
        ...createChecklistInput,
        orderIndex:
          typeof lastCheckList?.orderIndex === 'number'
            ? lastCheckList.orderIndex + 1
            : 0,
      },
    });

    await this.prisma.activity.create({
      data: {
        action: `added a checklist "${createChecklistInput.title}"`,
        userId,
        cardId: card.id,
      },
    });

    return newCheckList;
  }

  async findAll(cardId: string) {
    return await this.prisma.checklist.findMany({
      where: { cardId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    updateChecklistInput: UpdateChecklistInput,
    userId: string,
    boardId: string,
  ) {
    const existingChecklist = await this.prisma.checklist.findUnique({
      where: { id },
      include: {
        card: {
          select: {
            list: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!existingChecklist) throw new BadRequestException('Invalid checklist.');
    if (existingChecklist.card.list.boardId !== boardId)
      throw new BadRequestException('Invalid checklist or board.');
    const [updatedChecklist, newActivity] = await Promise.all([
      this.prisma.checklist.update({
        where: { id },
        data: { ...updateChecklistInput },
      }),
      this.prisma.activity.create({
        data: {
          action: `updated checklist title "${updateChecklistInput.title}"`,
          cardId: existingChecklist.cardId,
          userId,
        },
      }),
    ]);

    return updatedChecklist;
  }

  async remove(id: string, userId: string, boardId: string) {
    const existsChecklist = await this.prisma.checklist.findUnique({
      where: { id },
      include: {
        card: {
          select: {
            list: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });
    if (!existsChecklist)
      throw new BadRequestException(
        'Invalid checklist id. No checklist found.',
      );
    // Ensure checklist belongs to the same board
    if (existsChecklist.card.list.boardId !== boardId) {
      throw new BadRequestException('Checklist does not belong to this board.');
    }
    await Promise.all([
      this.prisma.checklist.delete({ where: { id } }),
      this.prisma.activity.create({
        data: {
          action: `removed checklist "${existsChecklist.title}"`,
          cardId: existsChecklist.cardId,
          userId,
        },
      }),
    ]);

    return 'successfully deleted checklist.';
  }
}
