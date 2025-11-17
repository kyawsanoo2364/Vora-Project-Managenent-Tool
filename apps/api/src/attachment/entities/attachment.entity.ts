import { Field, ObjectType } from '@nestjs/graphql';
import { Media } from 'src/media/entity/media.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class AttachmentEntity {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  uploadedBy: User;

  @Field()
  mediaId: string;

  @Field(() => Media)
  media: Media;

  @Field()
  createdAt: string;
}
