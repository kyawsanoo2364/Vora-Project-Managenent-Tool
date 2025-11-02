import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => Activity)
  createActivity(
    @Args('createActivityInput') createActivityInput: CreateActivityInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.activityService.create(createActivityInput, userId);
  }

  @Query(() => [Activity], { name: 'activity' })
  findAll() {
    return this.activityService.findAll();
  }

  @Query(() => Activity, { name: 'activity' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.activityService.findOne(id);
  }

  @Mutation(() => Activity)
  updateActivity(
    @Args('updateActivityInput') updateActivityInput: UpdateActivityInput,
  ) {
    return this.activityService.update(
      updateActivityInput.id,
      updateActivityInput,
    );
  }

  @Mutation(() => Activity)
  removeActivity(@Args('id', { type: () => Int }) id: number) {
    return this.activityService.remove(id);
  }
}
