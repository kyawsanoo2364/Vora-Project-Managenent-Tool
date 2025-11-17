import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardResolver } from './card.resolver';
import { ActivityModule } from 'src/activity/activity.module';
import { CardController } from './card.controller';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [ActivityModule, MediaModule],
  providers: [CardResolver, CardService],
  controllers: [CardController],
})
export class CardModule {}
