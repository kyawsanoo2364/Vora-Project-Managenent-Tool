import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChecklistItemService {
  constructor(private readonly prisma: PrismaService) {}

  private async logActivity(
    condition: boolean,
    action: string,
    userId: string,
    cardId: string,
  ) {
    if (condition) {
      await this.prisma.activity.create({ data: { action, userId, cardId } });
    }
  }

  async create(
    createChecklistItemInput: CreateChecklistItemInput,

    boardId: string,
  ) {
    const existingChecklist = await this.prisma.checklist.findUnique({
      where: {
        id: createChecklistItemInput.checklistId,
      },
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
      throw new BadRequestException('Invalid checklist or board');

    const lastItem = await this.prisma.checklistItem.findFirst({
      where: {
        checklistId: createChecklistItemInput.checklistId,
      },
      orderBy: {
        orderIndex: 'desc',
      },
    });
    const newItem = await this.prisma.checklistItem.create({
      data: {
        ...createChecklistItemInput,
        orderIndex:
          typeof lastItem?.orderIndex === 'number'
            ? lastItem.orderIndex + 1
            : 0,
      },
    });

    return newItem;
  }

  async findAll(checklistId: string, boardId: string) {
    const existingChecklist = await this.prisma.checklist.findUnique({
      where: { id: checklistId },
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
    if (!existingChecklist)
      throw new BadRequestException('Invalid checklist id');
    if (existingChecklist.card.list.boardId !== boardId)
      throw new BadRequestException('Invalid checklist id or board');

    return await this.prisma.checklistItem.findMany({
      where: {
        checklistId: checklistId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async update(
    id: string,
    updateChecklistItemInput: UpdateChecklistItemInput,
    boardId: string,
    userId: string,
  ) {
    const existingItem = await this.prisma.checklistItem.findUnique({
      where: { id },
      include: {
        checklist: {
          select: {
            card: {
              select: {
                id: true,
                list: {
                  select: {
                    boardId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!existingItem) throw new BadRequestException('Invalid Checklist Item.');
    if (existingItem.checklist.card.list.boardId !== boardId)
      throw new BadRequestException('Invalid checklist item or board');

    const oldContent = existingItem.content;
    const oldStatus = existingItem.isCompleted;

    let activityPromises: Promise<void>[] = [];

    if (
      updateChecklistItemInput.content !== null &&
      typeof updateChecklistItemInput.content !== 'undefined' &&
      updateChecklistItemInput.content !== oldContent
    ) {
      activityPromises.push(
        this.logActivity(
          true,
          `updated checklist item "${existingItem.content}" -> "${updateChecklistItemInput.content}"`,
          userId,
          existingItem.checklist.card.id,
        ),
      );
    }
    if (
      updateChecklistItemInput.isCompleted !== null &&
      typeof updateChecklistItemInput.isCompleted !== 'undefined' &&
      updateChecklistItemInput.isCompleted !== oldStatus
    ) {
      activityPromises.push(
        this.logActivity(
          true,
          updateChecklistItemInput.isCompleted
            ? `completed ${existingItem.content} on this card`
            : `marked ${existingItem.content} incomplete on this card`,
          userId,
          existingItem.checklist.card.id,
        ),
      );
    }

    if (
      (updateChecklistItemInput.startDate !== null &&
        typeof updateChecklistItemInput.startDate !== 'undefined' &&
        updateChecklistItemInput.startDate !== existingItem.startDate) ||
      (updateChecklistItemInput.dueDate !== null &&
        typeof updateChecklistItemInput.dueDate !== 'undefined' &&
        updateChecklistItemInput.dueDate !== existingItem.dueDate)
    ) {
      activityPromises.push(
        this.logActivity(
          true,
          `updated dates on checklist item "${existingItem.content}"`,
          userId,
          existingItem.checklist.card.id,
        ),
      );
    }

    const [updatedItem] = await Promise.all([
      this.prisma.checklistItem.update({
        where: { id },
        data: {
          ...updateChecklistItemInput,
        },
      }),
      ...activityPromises,
    ]);

    return updatedItem;
  }

  async remove(id: string, boardId: string) {
    const existingItem = await this.prisma.checklistItem.findUnique({
      where: { id },
      include: {
        checklist: {
          select: {
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
        },
      },
    });
    if (!existingItem) throw new BadRequestException('Invalid checklist item');
    if (existingItem.checklist.card.list.boardId !== boardId)
      throw new BadRequestException('Invalid checklist item or board');

    await this.prisma.checklistItem.delete({ where: { id } });

    return 'Successfully checklist item removed.';
  }
}
