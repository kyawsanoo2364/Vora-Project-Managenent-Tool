import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignMemberCardInput {
  @Field()
  cardId: string;

  @Field()
  memberId: string;
}
