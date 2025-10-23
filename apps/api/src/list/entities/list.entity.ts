import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class List {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  orderIndex: number;
}
