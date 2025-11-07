import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistResolver } from './checklist.resolver';

@Module({
  providers: [ChecklistResolver, ChecklistService],
})
export class ChecklistModule {}
