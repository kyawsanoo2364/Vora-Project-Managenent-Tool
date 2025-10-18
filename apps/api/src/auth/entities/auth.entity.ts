import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field()
  accessToken: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
