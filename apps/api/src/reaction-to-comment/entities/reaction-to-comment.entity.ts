import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class ReactionToComment {
  @Field()
  id: string;

  @Field()
  emoji: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  commentId: string;

  @Field(() => Comment)
  comment: Comment;

  @Field()
  createdAt: string;
}
