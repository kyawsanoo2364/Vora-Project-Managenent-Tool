import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentResolver } from './attachment.resolver';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  providers: [AttachmentResolver, AttachmentService],
})
export class AttachmentModule {}
