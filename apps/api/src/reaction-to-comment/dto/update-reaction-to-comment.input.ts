import { CreateReactionToCommentInput } from './create-reaction-to-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReactionToCommentInput extends PartialType(CreateReactionToCommentInput) {
  @Field(() => Int)
  id: number;
}
