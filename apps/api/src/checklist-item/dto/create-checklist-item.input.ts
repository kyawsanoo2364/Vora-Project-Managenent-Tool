import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChecklistItemInput {
  @Field()
  content: string;

  @Field()
  checklistId: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;
}
