import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Workspace } from 'src/workspace/entities/workspace.entity';

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

  @Field()
  createdAt: Date;
}
