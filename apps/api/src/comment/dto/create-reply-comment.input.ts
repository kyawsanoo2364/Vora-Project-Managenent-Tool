import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReplyCommentInput {
  @Field()
  content: string;

  @Field()
  replyToId: string;
}
