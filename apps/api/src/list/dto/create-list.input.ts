import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateListInput {
  @Field()
  name: string;

  @Field()
  boardId: string;
}
