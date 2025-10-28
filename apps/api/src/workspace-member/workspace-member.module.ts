import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberResolver } from './workspace-member.resolver';

@Module({
  providers: [WorkspaceMemberResolver, WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
