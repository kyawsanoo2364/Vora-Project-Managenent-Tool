import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  take: number;

  @Field({ nullable: true })
  cursor?: string;
}
