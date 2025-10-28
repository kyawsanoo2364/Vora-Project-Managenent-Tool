import { Test, TestingModule } from '@nestjs/testing';
import { InviteLinkResolver } from './invite-link.resolver';
import { InviteLinkService } from './invite-link.service';

describe('InviteLinkResolver', () => {
  let resolver: InviteLinkResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteLinkResolver, InviteLinkService],
    }).compile();

    resolver = module.get<InviteLinkResolver>(InviteLinkResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
