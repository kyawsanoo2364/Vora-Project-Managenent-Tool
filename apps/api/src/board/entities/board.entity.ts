import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { StarredBoardEntity } from './starred.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@ObjectType()
export class Board {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  background: string;

  @Field(() => Workspace)
  workspace: Workspace;

  @Field(() => [BoardMember], { nullable: true })
  members?: BoardMember[];

  @Field()
  createdAt: Date;

  @Field(() => [StarredBoardEntity])
  starred: StarredBoardEntity;
}
