import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChecklistInput {
  @Field()
  title: string;

  @Field()
  cardId: string;
}
