import { CreateChecklistInput } from './create-checklist.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChecklistInput extends PartialType(CreateChecklistInput) {
  @Field()
  id: string;
}
