import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class ReplyComment {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
