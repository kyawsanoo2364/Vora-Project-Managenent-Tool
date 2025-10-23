import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StarredBoardEntity {
  @Field()
  id: string;
}
