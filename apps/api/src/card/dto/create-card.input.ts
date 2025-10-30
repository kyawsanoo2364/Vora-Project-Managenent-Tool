import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  title: string;

  @Field()
  listId: string;
}
