import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateInviteLinkInput } from './dto/create-invite-link.input';

import { createHash, randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { ROLE } from 'src/utils/types/role.enum';
import { InviteToEmailInput } from './dto/invite-to-email.input';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class InviteLinkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private configService: ConfigService,
  ) {}

  private makeTokenHash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async create(createInviteLinkInput: CreateInviteLinkInput, userId: string) {
    const { scope, scopeId, role, maxUses } = createInviteLinkInput;
    if (scope.toLowerCase() === 'workspace') {
      const workspaceMember = await this.prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspaceId: scopeId,
        },
      });
      if (!workspaceMember)
        throw new ForbiddenException('You are not workspace member.');
      if (workspaceMember.role !== 'ADMIN')
        throw new ForbiddenException(
          "You can't create invite link.because you don't have permission.",
        );
    }
    const existingInviteLink = await this.prisma.inviteLink.findFirst({
      where: {
        scopeId,
        createdById: userId,

        revoked: false,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });
    if (existingInviteLink) {
      return {
        inviteLink: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/invite/${existingInviteLink.scopeId}/${existingInviteLink.tokenHash}`,
        expiresAt: existingInviteLink.expiresAt,
      };
    }
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.makeTokenHash(token);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days;

    const newInviteLink = await this.prisma.inviteLink.create({
      data: {
        tokenHash,
        expiresAt,
        scope,
        scopeId,
        createdById: userId,
        role,
        maxUses,
      },
    });

    return {
      inviteLink: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/invite/${newInviteLink.scopeId}/${newInviteLink.tokenHash}`,
      expiresAt: newInviteLink.expiresAt,
    };
  }

  async accept(token: string, userId: string) {
    const inviteLink = await this.prisma.inviteLink.findFirst({
      where: {
        tokenHash: token,
        revoked: false,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });
    if (!inviteLink) {
      throw new ForbiddenException('Invalid Invite link or expired!');
    }
    if (inviteLink.scope.toLowerCase() === 'workspace') {
      const existingWorkspaceMember =
        await this.prisma.workspaceMember.findFirst({
          where: {
            workspaceId: inviteLink.scopeId,
            userId,
          },
        });
      if (existingWorkspaceMember) {
        throw new BadRequestException(
          'You have already joined this workspace.',
        );
      }
      await this.prisma.workspaceMember.create({
        data: {
          role: inviteLink.role as ROLE,
          userId,
          workspaceId: inviteLink.scopeId,
        },
      });
    } else if (inviteLink.scope.toLowerCase() === 'board') {
      const existingBoardMember = await this.prisma.boardMember.findFirst({
        where: {
          boardId: inviteLink.scopeId,
          userId,
        },
      });
      if (existingBoardMember) {
        throw new BadRequestException('You have already joined this Board.');
      }
      await this.prisma.boardMember.create({
        data: {
          role: inviteLink.role as Role,
          boardId: inviteLink.scopeId,
          userId,
        },
      });
    }

    await this.prisma.$transaction([
      this.prisma.inviteLink.update({
        where: { id: inviteLink.id },
        data: {
          usedCount: { increment: 1 },
        },
      }),
    ]);

    return 'Successfully accept link.';
  }

  async revoke(scopeId: string, userId: string) {
    const invite = await this.prisma.inviteLink.findFirst({
      where: {
        scopeId,
        createdById: userId,
        revoked: false,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });
    if (!invite) {
      throw new BadRequestException('No active invite found');
    }

    await this.prisma.inviteLink.update({
      where: { id: invite.id },
      data: { revoked: true },
    });

    return 'Successfully! Invite link removed.';
  }

  findAll() {
    return `This action returns all inviteLink`;
  }

  async findOne(scopeId: string, userId: string) {
    const invite = await this.prisma.inviteLink.findFirst({
      where: {
        scopeId,
        createdById: userId,
        revoked: false,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });
    if (!invite) {
      return { id: null };
    }

    return invite;
  }

  async confirm(scopeId: string, token: string, userId: string) {
    const invite = await this.prisma.inviteLink.findFirst({
      where: {
        scopeId,
        tokenHash: token,
        revoked: false,
        OR: [
          { expiresAt: null },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!invite) {
      throw new ForbiddenException('Invalid invite link or expired');
    }
    const invitedByUserName = `${invite.createdBy.firstName} ${invite.createdBy.lastName}`;
    if (invite.scope.toLowerCase() === 'workspace') {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: invite.scopeId },
      });
      if (!workspace) {
        throw new ForbiddenException('Invalid Workspace');
      }

      const existingWorkspaceMember =
        await this.prisma.workspaceMember.findFirst({
          where: {
            userId: userId,
            workspaceId: workspace.id,
          },
        });

      if (existingWorkspaceMember) {
        return {
          alreadyJoined: true,
          scopeType: 'workspace',
        };
      }

      return {
        invitedBy: invitedByUserName,
        scopeName: workspace.name,
        scopeType: 'workspace',
      };
    } else if (invite.scope.toLowerCase() === 'board') {
      const board = await this.prisma.board.findUnique({
        where: { id: invite.scopeId },
      });
      if (!board) throw new ForbiddenException('Invalid board');

      const existingBoardMember = await this.prisma.boardMember.findFirst({
        where: {
          userId,
          boardId: board.id,
        },
      });
      if (existingBoardMember) {
        return {
          alreadyJoined: true,
          scopeType: 'board',
        };
      }

      return {
        invitedBy: invitedByUserName,
        scopeName: board.name,
        scopeType: 'board',
      };
    }
  }

  async inviteToEmail(inviteToEmailInput: InviteToEmailInput, userId: string) {
    //get current user info
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found in vora server.');
    // check scope "board" or "workspace"
    if (inviteToEmailInput.scope.toLowerCase() === 'board') {
      const board = await this.prisma.board.findUnique({
        where: {
          id: inviteToEmailInput.scopeId,
        },
        include: {
          workspace: true,
        },
      });

      if (!board) throw new BadRequestException('Invalid board');
      //check member role permission
      const member = await this.prisma.boardMember.findFirst({
        where: {
          boardId: board.id,
          userId,
        },
      });
      if (!member)
        throw new ForbiddenException('You are not this board member.');
      if (member.role === 'VIEWER')
        throw new ForbiddenException(
          "Permission denied! You can't send invite link.",
        );

      const { inviteLink, expiresAt } = await this.create(
        inviteToEmailInput,
        userId,
      );
      await this.emailService.sendBoardInvite(inviteToEmailInput.email, {
        recipientName: inviteToEmailInput.email,
        acceptLink: inviteLink,
        boardName: board.name,
        recipientEmail: inviteToEmailInput.email,
        workspaceName: board.workspace.name,
        inviterName: `${user.firstName} ${user.lastName}`,
        expirationDate: expiresAt
          ? new Date(expiresAt).toLocaleDateString('en-US', {
              minute: '2-digit',
              hour: '2-digit',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : undefined,
        role: inviteToEmailInput.role.toLowerCase(),
      });

      return 'Sent invite link successfully.';
    } else if (inviteToEmailInput.scope.toLowerCase() === 'workspace') {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: inviteToEmailInput.scopeId },
      });
      if (!workspace) throw new BadRequestException('Invalid workspace');
      //check current user member role
      const member = await this.prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspaceId: workspace.id,
        },
      });
      if (!member)
        throw new ForbiddenException('You are not this workspace member!');
      if (member.role !== 'ADMIN')
        throw new ForbiddenException('Permission Denied!');

      const { inviteLink, expiresAt } = await this.create(
        inviteToEmailInput,
        userId,
      );
      await this.emailService.sendWorkspaceInvite(inviteToEmailInput.email, {
        inviterName: `${user.firstName} ${user.lastName}`,
        acceptLink: inviteLink,
        workspaceName: workspace.name,
        expirationDate: expiresAt
          ? new Date(expiresAt).toLocaleDateString('en-US', {
              minute: '2-digit',
              hour: '2-digit',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : undefined,
        role: inviteToEmailInput.role.toLowerCase(),
        recipientEmail: inviteToEmailInput.email,
      });

      return 'Sent invite link successfully!';
    }
  }
}
