import { Module } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { BoardMemberResolver } from './board-member.resolver';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [BoardMemberResolver, BoardMemberService],
})
export class BoardMemberModule {}
