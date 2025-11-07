import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@ObjectType()
export class ChecklistItem {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => [BoardMember])
  assignMembers: BoardMember[];

  @Field(() => Int)
  orderIndex: number;

  @Field()
  createdAt: Date;
}
