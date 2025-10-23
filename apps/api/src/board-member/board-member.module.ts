import { Module } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { BoardMemberResolver } from './board-member.resolver';

@Module({
  providers: [BoardMemberResolver, BoardMemberService],
})
export class BoardMemberModule {}
