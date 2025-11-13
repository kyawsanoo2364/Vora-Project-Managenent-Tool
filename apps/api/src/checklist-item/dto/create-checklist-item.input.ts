import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChecklistItemInput {
  @Field()
  content: string;

  @Field()
  checklistId: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

  @Field(() => [String], { nullable: true })
  memberIds?: string[];
}
