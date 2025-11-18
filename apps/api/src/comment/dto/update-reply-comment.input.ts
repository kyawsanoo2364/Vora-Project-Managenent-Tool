import { Field, InputType } from '@nestjs/graphql';
import { CreateReplyCommentInput } from './create-reply-comment.input';

@InputType()
export class UpdateReplyCommentInput extends CreateReplyCommentInput {
  @Field()
  id: string;
}
