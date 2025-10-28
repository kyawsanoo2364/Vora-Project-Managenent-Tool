import { Field, InputType } from '@nestjs/graphql';
import { CreateInviteLinkInput } from './create-invite-link.input';

@InputType()
export class InviteToEmailInput extends CreateInviteLinkInput {
  @Field()
  email: string;
}
