import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  fullName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
