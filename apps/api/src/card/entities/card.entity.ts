import { ObjectType, Field, Int } from '@nestjs/graphql';

import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Checklist } from 'src/checklist/entities/checklist.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@ObjectType()
export class Card {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  listId: string;

  @Field()
  priority: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Checklist])
  checklists: Checklist[];

  @Field(() => [BoardMember])
  assignMembers: BoardMember[];

  @Field(() => Int)
  orderIndex: number;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
