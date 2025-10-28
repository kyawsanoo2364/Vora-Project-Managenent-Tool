import { Module } from '@nestjs/common';
import { InviteLinkService } from './invite-link.service';
import { InviteLinkResolver } from './invite-link.resolver';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [InviteLinkResolver, InviteLinkService],
})
export class InviteLinkModule {}
