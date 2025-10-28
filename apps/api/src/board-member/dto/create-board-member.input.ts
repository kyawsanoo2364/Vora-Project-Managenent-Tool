import { InputType, Int, Field } from '@nestjs/graphql';
import { ROLE } from 'src/utils/types/role.enum';

@InputType()
export class CreateBoardMemberInput {
  @Field(() => ROLE)
  role: ROLE;

  @Field()
  userId: string;
}
