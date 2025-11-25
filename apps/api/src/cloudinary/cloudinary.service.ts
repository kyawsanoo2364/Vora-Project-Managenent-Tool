import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, rej) => {
      const upload = v2.uploader.upload_stream((err, result) => {
        if (err) return rej(err);
        resolve(result as UploadApiResponse);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async removeFile(fileId: string) {
    try {
      await v2.uploader.destroy(fileId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
