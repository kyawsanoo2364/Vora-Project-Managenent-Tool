import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { BOARD_ROLES_KEY } from './board.role.decorator';

@Injectable()
export class BoardPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestRoles = this.reflector.getAllAndOverride(BOARD_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requestRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const args = ctx.getArgs();

    if (!user) {
      throw new UnauthorizedException();
    }

    const boardId = args.boardId;
    if (!boardId) {
      throw new Error('boardId must be provided in arguments');
    }

    const member = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userId: user.id,
      },
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this board');
    }

    if (!requestRoles.includes(member.role)) {
      throw new ForbiddenException(
        "Permission denied! You can't manage this with your role.",
      );
    }

    return true;
  }
}
