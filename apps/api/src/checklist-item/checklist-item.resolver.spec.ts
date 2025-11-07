import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistItemResolver } from './checklist-item.resolver';
import { ChecklistItemService } from './checklist-item.service';

describe('ChecklistItemResolver', () => {
  let resolver: ChecklistItemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChecklistItemResolver, ChecklistItemService],
    }).compile();

    resolver = module.get<ChecklistItemResolver>(ChecklistItemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
