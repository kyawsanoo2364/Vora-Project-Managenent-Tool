import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Media } from 'src/media/entity/media.entity';

@ObjectType()
export class Workspace {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  slug: string;

  @Field(() => Media, { nullable: true })
  logo?: Media;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
