import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';

import { WorkspacePermissionGuard } from 'src/common/workspace-permission/workspace-permission.guard';
import { WorkspaceRoles } from 'src/common/workspace-permission/workspace-permission.decorator';

@Resolver(() => WorkspaceMember)
export class WorkspaceMemberResolver {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @UseGuards(JWTAuthGuard, WorkspacePermissionGuard)
  @WorkspaceRoles('ADMIN', 'MEMBER')
  @Query(() => WorkspaceMember)
  getMember(@Args('workspaceId') workspaceId: string, @Context() context: any) {
    const userId = context.req.user.id;
    return this.workspaceMemberService.getMember(workspaceId, userId);
  }

  @UseGuards(JWTAuthGuard, WorkspacePermissionGuard)
  @WorkspaceRoles('ADMIN', 'MEMBER')
  @Query(() => [WorkspaceMember])
  getAllWorkspaceMember(@Args('workspaceId') workspaceId: string) {
    return this.workspaceMemberService.getAllMember(workspaceId);
  }

  @UseGuards(JWTAuthGuard, WorkspacePermissionGuard)
  @Mutation(() => WorkspaceMember)
  @WorkspaceRoles('ADMIN')
  updateWorkspaceMemberRole(
    @Args('id') id: string,
    @Args('role') role: string,
    @Args('workspaceId') workspaceId: string,
  ) {
    return this.workspaceMemberService.updateMemberRole(id, role);
  }

  @UseGuards(JWTAuthGuard, WorkspacePermissionGuard)
  @WorkspaceRoles('ADMIN', 'MEMBER')
  @Mutation(() => String)
  removeWorkspaceMember(
    @Args('id') id: string,
    @Args('workspaceId') workspaceId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.workspaceMemberService.removeMember(id, workspaceId, userId);
  }
}
