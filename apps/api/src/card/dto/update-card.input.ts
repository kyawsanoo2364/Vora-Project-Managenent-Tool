import { CreateCardInput } from './create-card.input';
import {
  InputType,
  Field,
  Int,
  PartialType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@InputType()
export class UpdateCardInput extends PartialType(CreateCardInput) {
  @Field()
  id: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  priority?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;
}
