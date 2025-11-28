import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { HttpCode, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => Workspace)
  createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.workspaceService.create(createWorkspaceInput, user.id);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [Workspace], { name: 'get_all_my_workspaces' })
  @HttpCode(200)
  findAll(@Context() context) {
    const user = context.req.user;
    return this.workspaceService.findAll(user.id);
  }
}
