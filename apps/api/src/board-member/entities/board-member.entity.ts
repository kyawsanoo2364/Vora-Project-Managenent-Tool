import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class BoardMember {
  @Field()
  id: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  role: string;
}
