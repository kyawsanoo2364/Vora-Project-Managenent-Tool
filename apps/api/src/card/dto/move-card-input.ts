import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MoveCardInput {
  @Field()
  cardId: string;

  @Field()
  toBoardId: string;

  @Field()
  toListId: string;

  @Field(() => Int)
  cardPos: number;
}
