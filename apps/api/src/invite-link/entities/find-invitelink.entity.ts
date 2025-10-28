import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FindInviteLink {
  @Field({ nullable: true })
  id?: string;
}
