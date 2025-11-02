import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardResolver } from './card.resolver';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [ActivityModule],
  providers: [CardResolver, CardService],
})
export class CardModule {}
