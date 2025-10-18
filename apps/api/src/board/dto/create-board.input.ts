import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field()
  name: string;

  @Field()
  background: string;

  @Field()
  workspaceId: string;

  @Field({ nullable: true })
  description?: string;
}
