import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { WORKSPACE_ROLE_KEY } from './workspace-permission.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspacePermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requestRoles = this.reflector.getAllAndOverride(WORKSPACE_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requestRoles) return true;
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const args = ctx.getArgs();

    if (!args.workspaceId) throw new Error('WorkspaceId is required.');

    const workspaceMember = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId: args.workspaceId,
        userId: user.id,
      },
    });
    if (!workspaceMember)
      throw new ForbiddenException('You are not this workspace member.');
    if (!requestRoles.includes(workspaceMember.role))
      throw new ForbiddenException(
        "Permission denied! You can't manage this with your role.",
      );
    return true;
  }
}
