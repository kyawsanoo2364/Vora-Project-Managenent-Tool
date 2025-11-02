import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateActivityInput {
  @Field()
  action: string;

  @Field({ nullable: true })
  cardId?: string;

  @Field({ nullable: true })
  listId?: string;
}
