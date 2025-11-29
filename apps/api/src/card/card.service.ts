import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityService } from 'src/activity/activity.service';
import { AssignMemberCardInput } from './dto/assign-member-card.input';
import { validateFileUrl } from 'src/utils/validateFileUrl';
import { MediaService } from 'src/media/media.service';
import { MoveCardInput } from './dto/move-card-input';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
    private readonly media: MediaService,
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

  async getAssignedMember(cardId: string, boardId: string) {
    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        assignMembers: {
          include: { user: true },
        },

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

    return card.assignMembers;
  }

  async addAssignMember(
    assignMemberCardInput: AssignMemberCardInput,
    boardId: string,
    userId: string,
  ) {
    const existingCard = await this.prisma.card.findUnique({
      where: { id: assignMemberCardInput.cardId },
      include: {
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!existingCard) throw new BadRequestException('Invalid card id');
    if (existingCard.list.boardId !== boardId)
      throw new BadRequestException('Invalid card id or board');
    const member = await this.prisma.boardMember.findFirst({
      where: {
        id: assignMemberCardInput.memberId,
        boardId,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });
    if (!member) throw new BadRequestException('Invalid board member');

    await this.prisma.card.update({
      where: { id: assignMemberCardInput.cardId },
      data: {
        assignMembers: {
          connect: {
            id: assignMemberCardInput.memberId,
          },
        },
      },
    });

    await this.activityService.create(
      {
        cardId: assignMemberCardInput.cardId,
        action:
          member.userId === userId
            ? `joined the card "${existingCard.title}"`
            : `added ${member.user.firstName} ${member.user.lastName} to this card`,
      },
      userId,
    );

    return 'Assigned member successfully!';
  }

  async removeAssignMember(
    assignMemberCardInput: AssignMemberCardInput,
    boardId: string,
    userId: string,
  ) {
    const card = await this.prisma.card.findUnique({
      where: { id: assignMemberCardInput.cardId },
      include: {
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card id');
    if (card.list.boardId !== boardId)
      throw new BadRequestException('Invalid card or board');
    const member = await this.prisma.boardMember.findFirst({
      where: {
        id: assignMemberCardInput.memberId,
        boardId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!member) throw new BadRequestException('Invalid board member');
    await this.prisma.card.update({
      where: { id: assignMemberCardInput.cardId },
      data: {
        assignMembers: {
          disconnect: {
            id: assignMemberCardInput.memberId,
          },
        },
      },
    });

    await this.activityService.create(
      {
        action:
          userId === member.userId
            ? `left from this card.`
            : `removed ${member.user.firstName} ${member.user.lastName} from this card.`,
        cardId: assignMemberCardInput.cardId,
      },
      userId,
    );

    return 'UnAssigned member successfully';
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
        cover: {
          include: {
            media: true,
          },
        },
        checklists: {
          orderBy: {
            orderIndex: 'asc',
          },
          include: {
            items: {
              orderBy: {
                orderIndex: 'asc',
              },
              include: {
                assignMembers: {
                  include: {
                    user: true,
                  },
                },
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
            uploadedBy: true,
            media: true,
          },
        },
      },
    });
    if (!card) throw new NotFoundException('No Card found!');

    return card;
  }
  //get current card position and current list
  async getCurrentCardPosAndList(cardId: string) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new BadRequestException('Invalid Card');
    return { listId: card.listId, orderIndex: card.orderIndex };
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

  async addCover(cardId: string, attachmentId: string, boardId: string) {
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        list: {
          boardId,
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card or board');
    const attachment = await this.prisma.attachment.findFirst({
      where: {
        id: attachmentId,
        cardId,
      },
    });
    if (!attachment) {
      throw new BadRequestException('Invalid Attachment Media.');
    }

    if (card.coverId) {
      await this.prisma.card.update({
        where: {
          id: card.id,
        },
        data: {
          cover: {
            disconnect: {
              id: card.coverId,
            },
          },
        },
      });
    }

    await this.prisma.card.update({
      where: {
        id: card.id,
      },
      data: {
        cover: {
          connect: {
            id: attachmentId,
          },
        },
      },
    });

    return 'Successfully card cover added';
  }

  async removeCover(cardId: string, boardId: string) {
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        list: {
          boardId,
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card or board');
    await this.prisma.card.update({
      where: { id: card.id },
      data: {
        cover: {
          disconnect: true,
        },
      },
    });

    return 'Successfully card cover removed!';
  }

  async addAttachmentFileFromURL(
    cardId: string,
    url: string,
    userId: string,
    boardId: string,
  ) {
    const { isValid, type } = await validateFileUrl(url);

    if (!isValid) throw new BadRequestException('Invalid URL.');

    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
        list: {
          boardId,
        },
      },
    });
    if (!card) throw new BadRequestException('Invalid card or board');

    const media = await this.prisma.media.create({
      data: {
        filename: url.split('/').pop() || 'unknown',
        type: type || 'unknown',
        url: url,
      },
    });

    const attachment = await this.prisma.attachment.create({
      data: {
        cardId,
        mediaId: media.id,
        userId,
      },
    });

    await this.prisma.activity.create({
      data: {
        action: `added attachment file`,
        cardId,
        userId,
      },
    });

    return attachment;
  }

  async addAttachmentFile(
    cardId: string,
    file: Express.Multer.File,
    userId: string,
    boardId: string,
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
    const uploaded = await this.media.uploadFile(file);
    const newAttachment = await this.prisma.attachment.create({
      data: {
        cardId,
        userId,
        mediaId: uploaded.data.fileId,
      },
      include: {
        media: true,
        uploadedBy: true,
      },
    });

    return newAttachment;
  }

  async moveCard(moveCardInput: MoveCardInput, userId: string) {
    const { cardId, cardPos, toListId, toBoardId } = moveCardInput;
    const toBoard = await this.prisma.board.findUnique({
      where: { id: toBoardId },
    });
    if (!toBoard) throw new BadRequestException('Invalid toBoard Id');
    const toBoardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId: toBoardId,
        userId,
      },
    });
    if (!toBoardMember)
      throw new ForbiddenException(
        `Permission denied! You’re not a member of the board`,
      );
    if (toBoardMember.role === 'VIEWER')
      throw new ForbiddenException(
        'Permission Denied! You cannot move this card',
      );

    const list = await this.prisma.list.findUnique({
      where: { id: toListId },
      include: { cards: true },
    });
    if (!list) throw new BadRequestException('Invalid List');
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new BadRequestException('Invalid Card');
    //check card position is valid or invalid. cardPos starts from 0.
    if (list.cards.length > 0 && cardPos > list.cards.length) {
      throw new BadRequestException('Invalid card position');
    }
    const otherCards = list.cards;
    otherCards.splice(cardPos, 0, card);

    const updates = otherCards.map((card, i) => {
      return this.prisma.card.update({
        where: { id: card.id },
        data: {
          listId: list.id,
          orderIndex: i,
        },
      });
    });

    await this.prisma.$transaction(updates);

    await this.logActivity(
      true,
      `moved to board "${toBoard.name}", list "${list.name}"`,
      cardId,
      userId,
    );

    return 'Card moved successfully!';
  }
}
