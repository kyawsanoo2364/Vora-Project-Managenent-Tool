import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAttachmentInput {
  @Field()
  filename: string;
}
