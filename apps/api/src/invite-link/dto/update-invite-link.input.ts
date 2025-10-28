import { CreateInviteLinkInput } from './create-invite-link.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInviteLinkInput extends PartialType(CreateInviteLinkInput) {
  @Field(() => Int)
  id: number;
}
