import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Card } from 'src/card/entities/card.entity';

@ObjectType()
export class List {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  orderIndex: number;

  @Field(() => [Card])
  cards: Card[];
}
