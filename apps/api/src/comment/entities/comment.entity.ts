import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { ReplyComment } from './reply-comment.entity';
import { ReactionToComment } from 'src/reaction-to-comment/entities/reaction-to-comment.entity';
import { ReactionsWithGroup } from 'src/reaction-to-comment/entities/reactionsWithGroup.enitity';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [ReactionsWithGroup])
  reactions: ReactionsWithGroup[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
