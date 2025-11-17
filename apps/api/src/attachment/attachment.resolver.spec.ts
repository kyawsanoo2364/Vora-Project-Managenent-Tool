import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentService } from './attachment.service';

describe('AttachmentResolver', () => {
  let resolver: AttachmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttachmentResolver, AttachmentService],
    }).compile();

    resolver = module.get<AttachmentResolver>(AttachmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
