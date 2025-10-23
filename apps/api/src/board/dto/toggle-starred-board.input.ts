import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ToggleStarredBoardInput {
  @Field()
  workspaceId: string;

  @Field()
  boardId: string;
}
