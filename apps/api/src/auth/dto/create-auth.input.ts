import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class CreateAuthInput {
  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  @IsString()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}
