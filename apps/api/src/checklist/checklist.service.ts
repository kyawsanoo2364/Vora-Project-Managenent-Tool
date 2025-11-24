import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateForCreateAndGetLastChecklist(
    cardId: string,
    boardId: string,
  ) {
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
    if (!card) throw new BadRequestException('Invalid card');
    if (card.list.boardId !== boardId)
      throw new BadRequestException('Invalid card or board');
    const lastCheckList = await this.prisma.checklist.findFirst({
      where: {
        cardId: cardId,
      },
      orderBy: {
        orderIndex: 'desc',
      },
    });

    return lastCheckList;
  }

  async create(
    createChecklistInput: CreateChecklistInput,
    userId: string,
    boardId: string,
  ) {
    const lastCheckList = await this.validateForCreateAndGetLastChecklist(
      createChecklistInput.cardId,
      boardId,
    );
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
        cardId: createChecklistInput.cardId,
      },
    });

    return newCheckList;
  }

  async duplicate(
    id: string,
    createChecklistInput: CreateChecklistInput,
    boardId: string,
    userId: string,
  ) {
    const checklist = await this.prisma.checklist.findFirst({
      where: {
        id,
        card: {
          list: {
            boardId,
          },
        },
      },
      include: {
        items: {
          include: {
            assignMembers: true,
          },
        },
      },
    });
    if (!checklist) throw new BadRequestException('Invalid checklist or board');
    const lastCheckList = await this.validateForCreateAndGetLastChecklist(
      createChecklistInput.cardId,
      boardId,
    );
    const newCheckList = await this.prisma.checklist.create({
      data: {
        title: createChecklistInput.title,
        cardId: createChecklistInput.cardId,
        orderIndex: lastCheckList?.orderIndex
          ? lastCheckList.orderIndex + 1
          : 0,
        items: {
          createMany: {
            data: checklist.items.map((data) => ({
              content: data.content,
              dueDate: data.dueDate,
              isCompleted: data.isCompleted,
              orderIndex: data.orderIndex,
            })),
          },
        },
      },
      include: {
        items: {
          include: {
            assignMembers: true,
          },
        },
      },
    });

    await this.prisma.activity.create({
      data: {
        action: `added a checklist "${createChecklistInput.title}"`,
        userId,
        cardId: createChecklistInput.cardId,
      },
    });

    return newCheckList;
  }

  async findAllByBoardId(boardId: string) {
    return await this.prisma.checklist.findMany({
      where: {
        card: {
          list: {
            boardId,
          },
        },
      },
      include: {
        items: true,
      },
    });
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

  async updateChecklistPos(id: string, orderIndex: number, cardId: string) {
    const checklists = await this.prisma.checklist.findMany({
      where: {
        cardId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });

    const movedItem = checklists.find((c) => c.id === id);
    if (!movedItem) {
      throw new BadRequestException('Invalid Checklist');
    }
    const filteredChecklists = checklists.filter((c) => c.id !== id);
    // Bound check (optional but recommended)
    if (orderIndex < 0 || orderIndex > filteredChecklists.length) {
      throw new BadRequestException('Invalid order index');
    }
    filteredChecklists.splice(orderIndex, 0, movedItem);

    const updates = filteredChecklists.map((checklist, i) => {
      return this.prisma.checklist.update({
        where: { id: checklist.id },
        data: {
          orderIndex: i,
        },
      });
    });

    await this.prisma.$transaction(updates);

    return 'Successfully checklist position updated.';
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
