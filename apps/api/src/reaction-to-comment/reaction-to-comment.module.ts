import { Module } from '@nestjs/common';
import { ReactionToCommentService } from './reaction-to-comment.service';
import { ReactionToCommentResolver } from './reaction-to-comment.resolver';

@Module({
  providers: [ReactionToCommentResolver, ReactionToCommentService],
})
export class ReactionToCommentModule {}
