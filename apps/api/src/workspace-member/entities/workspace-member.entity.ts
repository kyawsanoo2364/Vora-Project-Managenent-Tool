import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class WorkspaceMember {
  @Field()
  id: string;

  @Field()
  role: string;

  @Field()
  workspaceId: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;
}
