import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfirmInvite {
  @Field({ nullable: true })
  invitedBy?: string;

  @Field({ nullable: true })
  scopeName?: string;

  @Field()
  scopeType: string;

  @Field(() => Boolean, { defaultValue: false })
  alreadyJoined: boolean;
}
