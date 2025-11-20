import { Test, TestingModule } from '@nestjs/testing';
import { ReactionToCommentService } from './reaction-to-comment.service';

describe('ReactionToCommentService', () => {
  let service: ReactionToCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionToCommentService],
    }).compile();

    service = module.get<ReactionToCommentService>(ReactionToCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
