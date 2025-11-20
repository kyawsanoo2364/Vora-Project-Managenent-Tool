import { Test, TestingModule } from '@nestjs/testing';
import { ReactionToCommentResolver } from './reaction-to-comment.resolver';
import { ReactionToCommentService } from './reaction-to-comment.service';

describe('ReactionToCommentResolver', () => {
  let resolver: ReactionToCommentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionToCommentResolver, ReactionToCommentService],
    }).compile();

    resolver = module.get<ReactionToCommentResolver>(ReactionToCommentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
