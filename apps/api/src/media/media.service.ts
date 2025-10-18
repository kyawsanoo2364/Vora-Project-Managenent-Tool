import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from '@web-std/file';
import { PrismaService } from 'src/prisma/prisma.service';
import { UTApi } from 'uploadthing/server';

@Injectable()
export class MediaService {
  private utapi: UTApi;

  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.utapi = new UTApi({
      token: configService.get<string>('UPLOADTHING_TOKEN'),
      logLevel: 'All',
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const unit8 = new Uint8Array(file.buffer);
    const nodeFile = new File([unit8], file.originalname, {
      type: file.mimetype,
    });
    try {
      const res = await this.utapi.uploadFiles([nodeFile]);

      if (!res || res.length <= 0 || !res[0].data) {
        throw new Error('Uploadthing returned empty response');
      }
      const media = await this.prisma.media.create({
        data: {
          url: res[0].data.url,
          filename: res[0].data.name,
          type: res[0].data.type,
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
    } catch (error) {
      throw new RequestTimeoutException(error.message || 'Upload Failed');
    }
  }
}
