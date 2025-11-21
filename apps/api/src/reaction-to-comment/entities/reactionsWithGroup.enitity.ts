import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReactionsWithGroup {
  @Field()
  emoji: string;

  @Field(() => Int)
  count: number;

  @Field(() => [String])
  users: string[];

  @Field(() => Boolean)
  reactedByUser: boolean;
}
