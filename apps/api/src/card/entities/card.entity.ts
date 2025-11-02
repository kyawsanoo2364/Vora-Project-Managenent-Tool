import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Card {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  listId: string;
}
