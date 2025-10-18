import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Media {
  @Field()
  id: string;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  type: string;

  @Field()
  createdAt: Date;
}
