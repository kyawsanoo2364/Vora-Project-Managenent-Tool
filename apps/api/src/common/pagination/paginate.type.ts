import { Field, ObjectType } from '@nestjs/graphql';

export function Paginated<T>(classRef: new () => T) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    items: T[];

    @Field({ nullable: true })
    nextCursor?: string;
  }

  return PaginatedType;
}
