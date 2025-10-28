import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceMemberResolver } from './workspace-member.resolver';
import { WorkspaceMemberService } from './workspace-member.service';

describe('WorkspaceMemberResolver', () => {
  let resolver: WorkspaceMemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceMemberResolver, WorkspaceMemberService],
    }).compile();

    resolver = module.get<WorkspaceMemberResolver>(WorkspaceMemberResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
