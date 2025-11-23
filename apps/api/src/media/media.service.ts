import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from '@web-std/file';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UTApi } from 'uploadthing/server';

@Injectable()
export class MediaService {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const data = await this.cloudinary.uploadFile(file);

    const media = await this.prisma.media.create({
      data: {
        fileId: data.public_id,
        url: data.secure_url,
        filename: data.original_filename,
        type: data.type,
      },
    });
    return {
      success: true,
      message: 'Uploaded file successfully!',
      data: {
        fileId: media.id,
        url: media.url,
        name: media.filename,
        type: media.type,
      },
    };
  }
  catch(error) {
    throw new RequestTimeoutException(error.message || 'Upload Failed');
  }

  async removeMedia(mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });
    if (!media) throw new BadRequestException('Invalid Media');
    if (media.fileId) {
      try {
        await this.cloudinary.removeFile(media.fileId);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
    await this.prisma.media.delete({ where: { id: mediaId } });
    return { success: true, message: 'Successfully removed media file!' };
  }
}
