import { CreateBoardMemberInput } from './create-board-member.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBoardMemberInput extends PartialType(
  CreateBoardMemberInput,
) {
  @Field()
  id: string;
}
