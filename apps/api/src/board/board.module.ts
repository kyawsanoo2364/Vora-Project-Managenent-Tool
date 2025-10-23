import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardResolver } from './board.resolver';
import { ListModule } from 'src/list/list.module';

@Module({
  imports: [ListModule],
  providers: [BoardResolver, BoardService],
})
export class BoardModule {}
