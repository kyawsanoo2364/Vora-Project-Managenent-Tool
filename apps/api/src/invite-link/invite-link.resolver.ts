import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { InviteLinkService } from './invite-link.service';
import { InviteLink } from './entities/invite-link.entity';
import { CreateInviteLinkInput } from './dto/create-invite-link.input';

import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { FindInviteLink } from './entities/find-invitelink.entity';
import { ConfirmInvite } from './entities/confirm-invite.entity';
import { InviteToEmailInput } from './dto/invite-to-email.input';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => InviteLink)
export class InviteLinkResolver {
  constructor(private readonly inviteLinkService: InviteLinkService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => InviteLink)
  createInviteLink(
    @Args('createInviteLinkInput') createInviteLinkInput: CreateInviteLinkInput,
    @Context() context,
  ) {
    const userId = context.req.user.id;
    return this.inviteLinkService.create(createInviteLinkInput, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => String)
  acceptLink(@Args('token') token: string, @Context() context) {
    const userId = context.req.user.id;
    return this.inviteLinkService.accept(token, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => String)
  revokeLink(@Args('scopeId') scopeId: string, @Context() context) {
    const userId = context.req.user.id;
    return this.inviteLinkService.revoke(scopeId, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => ConfirmInvite)
  confirmLink(
    @Args('scopeId') scopeId: string,
    @Args('token') token: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.inviteLinkService.confirm(scopeId, token, userId);
  }

  @Query(() => String, { name: 'inviteLink' })
  findAll() {
    return this.inviteLinkService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => FindInviteLink)
  getInvite(@Args('scopeId') scopeId: string, @Context() context: any) {
    const userId = context.req.user.id;
    return this.inviteLinkService.findOne(scopeId, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => String)
  inviteLinkUsingMail(
    @Args('inviteToEmailInput') inviteToEmailInput: InviteToEmailInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.inviteLinkService.inviteToEmail(inviteToEmailInput, userId);
  }
}
