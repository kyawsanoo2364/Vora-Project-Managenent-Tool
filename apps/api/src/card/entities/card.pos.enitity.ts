import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CardPos {
  @Field()
  listId: string;

  @Field(() => Int)
  orderIndex: number;
}
