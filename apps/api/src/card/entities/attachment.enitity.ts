import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AttachmentEntity {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  mediaId: string;

  @Field()
  createdAt: string;
}
