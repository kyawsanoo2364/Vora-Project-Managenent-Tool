import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ChecklistItem } from '../../checklist-item/entities/checklist-item.enitity';

@ObjectType()
export class Checklist {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  cardId: string;

  @Field(() => [ChecklistItem])
  items: ChecklistItem[];

  @Field()
  orderIndex: string;

  @Field()
  createdAt: Date;
}
