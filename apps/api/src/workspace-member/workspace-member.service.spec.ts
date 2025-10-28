import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceMemberService } from './workspace-member.service';

describe('WorkspaceMemberService', () => {
  let service: WorkspaceMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceMemberService],
    }).compile();

    service = module.get<WorkspaceMemberService>(WorkspaceMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
