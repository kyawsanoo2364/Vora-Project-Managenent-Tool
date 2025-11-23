import { BadRequestException, Injectable } from '@nestjs/common';

import { UpdateAttachmentInput } from './dto/update-attachment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  findAll() {
    return `This action returns all attachment`;
  }

  async update(
    id: string,
    updateAttachmentInput: UpdateAttachmentInput,
    boardId: string,
    userId: string,
  ) {
    const attachment = await this.prisma.attachment.findFirst({
      where: {
        id,
        card: {
          list: {
            boardId,
          },
        },
      },
      include: {
        media: true,
      },
    });
    if (!attachment)
      throw new BadRequestException('Invalid Attachment or Board');
    const updatedAttachment = await this.prisma.attachment.update({
      where: { id },
      data: {
        media: {
          update: {
            filename: updateAttachmentInput.filename,
          },
        },
      },
      include: {
        media: true,
      },
    });

    await this.prisma.activity.create({
      data: {
        action: `updated attachment file '${attachment.media.filename.slice(0, 10)}...' -> '${updatedAttachment.media.filename}'`,
        userId,
        cardId: updatedAttachment.cardId,
      },
    });

    return updatedAttachment;
  }

  async remove(id: string, boardId: string, userId: string) {
    const attachment = await this.prisma.attachment.findFirst({
      where: {
        id,
        card: {
          list: {
            boardId,
          },
        },
      },
    });

    if (!attachment)
      throw new BadRequestException('Invalid Attachment or Board');
    const deletedAttachment = await this.prisma.attachment.delete({
      where: {
        id,
      },
      include: {
        media: true,
      },
    });

    await this.media.removeMedia(deletedAttachment.mediaId);

    await this.prisma.activity.create({
      data: {
        action: `removed attachment file '${deletedAttachment.media.filename.slice(0, 10)}...'`,
        userId,
        cardId: deletedAttachment.cardId,
      },
    });

    return deletedAttachment;
  }
}
