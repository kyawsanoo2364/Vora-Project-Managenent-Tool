import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityResolver } from './activity.resolver';

@Module({
  providers: [ActivityResolver, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
