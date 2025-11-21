import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { ReactionToCommentModule } from 'src/reaction-to-comment/reaction-to-comment.module';

@Module({
  imports: [ReactionToCommentModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
