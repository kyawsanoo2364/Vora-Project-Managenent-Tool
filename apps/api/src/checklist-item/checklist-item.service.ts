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
    const { memberIds, dueDate, ...otherData } = createChecklistItemInput;
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

    if (memberIds) {
      await Promise.all(
        memberIds.map(async (id) => {
          const getBoardMember = await this.prisma.boardMember.findUnique({
            where: { id },
          });
          if (!getBoardMember)
            throw new BadRequestException('Invalid Board Member id');
          if (getBoardMember.boardId !== boardId)
            throw new BadRequestException(
              `Board member ${id} does not belong to this board`,
            );
        }),
      );
    }

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
        ...otherData,
        assignMembers:
          memberIds && memberIds.length > 0
            ? {
                connect: memberIds.map((id) => ({ id })),
              }
            : undefined,
        orderIndex:
          typeof lastItem?.orderIndex === 'number'
            ? lastItem.orderIndex + 1
            : 0,
        dueDate: dueDate ? dueDate : undefined,
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
      typeof updateChecklistItemInput.dueDate !== 'undefined' &&
      ((updateChecklistItemInput.dueDate === null &&
        existingItem.dueDate !== null) ||
        (updateChecklistItemInput.dueDate !== null &&
          new Date(updateChecklistItemInput.dueDate).getTime() !==
            existingItem.dueDate?.getTime()))
    ) {
      activityPromises.push(
        this.logActivity(
          true,
          `updated due date on checklist item "${existingItem.content}"`,
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

  async addAssignMember(
    id: string,
    memberId: string,
    boardId: string,
    userId: string,
  ) {
    const item = await this.prisma.checklistItem.findFirst({
      where: {
        id,
        checklist: {
          card: {
            list: {
              boardId,
            },
          },
        },
      },
      include: {
        checklist: {
          select: {
            cardId: true,
          },
        },
      },
    });
    if (!item) throw new BadRequestException('Invalid ChecklistItem or board');

    const member = await this.prisma.boardMember.findFirst({
      where: {
        id: memberId,
        boardId,
      },
      include: {
        user: true,
      },
    });
    if (!member) throw new BadRequestException('Invalid board member');

    const alreadyAssigned = await this.prisma.checklistItem.findFirst({
      where: {
        id,
        assignMembers: {
          some: {
            id: memberId,
          },
        },
      },
    });

    if (alreadyAssigned)
      throw new BadRequestException('Member already assigned!');

    await this.prisma.checklistItem.update({
      where: { id },
      data: {
        assignMembers: {
          connect: {
            id: memberId,
          },
        },
      },
    });

    await this.logActivity(
      true,
      `added '${member.user.firstName} ${member.user.lastName}' to '${item.content}' checklist item`,
      userId,
      item.checklist.cardId,
    );

    return 'Member assigned successfully';
  }

  async removeAssignedMember(
    id: string,
    memberId: string,
    boardId: string,
    userId: string,
  ) {
    const checklistItem = await this.prisma.checklistItem.findFirst({
      where: {
        id,
        checklist: {
          card: {
            list: {
              boardId,
            },
          },
        },
        assignMembers: {
          some: {
            id: memberId,
          },
        },
      },
      include: {
        checklist: {
          select: { cardId: true },
        },
        assignMembers: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!checklistItem) throw new BadRequestException('Invalid Item or Member');

    await this.prisma.checklistItem.update({
      where: { id },
      data: {
        assignMembers: {
          disconnect: {
            id: memberId,
          },
        },
      },
    });

    const removedUser = checklistItem.assignMembers.find(
      (m) => m.id === memberId,
    )?.user;

    await this.logActivity(
      true,
      `removed '${removedUser ? removedUser.firstName + ' ' + removedUser.lastName : 'a user'} ' from '${checklistItem.content}'`,
      userId,
      checklistItem.checklist.cardId,
    );

    return 'Member removed successfully';
  }
}
