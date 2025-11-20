import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReactionToCommentInput {
  @Field()
  emoji: string;

  @Field()
  commentId: string;
}
