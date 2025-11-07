import { Module } from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { ChecklistItemResolver } from './checklist-item.resolver';

@Module({
  providers: [ChecklistItemResolver, ChecklistItemService],
})
export class ChecklistItemModule {}
