import { InputType, Int, Field } from '@nestjs/graphql';
import { ROLE } from 'src/utils/types/role.enum';

@InputType()
export class CreateInviteLinkInput {
  @Field()
  scope: string;

  @Field()
  scopeId: string;

  @Field(() => ROLE, { defaultValue: ROLE.MEMBER })
  role: ROLE;

  @Field(() => Int, { nullable: true })
  maxUses?: number;
}
