import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE } from 'src/utils/types/role.enum';

@Injectable()
export class WorkspaceMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getMember(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    return member;
  }

  async getAllMember(workspaceId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: true,
      },
    });

    return [
      ...members.map((m) => ({
        ...m,
        user: { ...m.user, fullName: `${m.user.firstName} ${m.user.lastName}` },
      })),
    ];
  }

  async updateMemberRole(id: string, role: string) {
    const updatedMember = await this.prisma.workspaceMember.update({
      where: {
        id,
      },
      data: {
        role: role as Role,
      },
    });

    return updatedMember;
  }

  async removeMember(id: string, workspaceId: string, userId: string) {
    // current user workspace member
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });
    if (!member) throw new NotFoundException('Workspace Member not found');
    //for delete member
    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: { id },
    });
    if (!existingMember)
      throw new NotFoundException('Invalid Workspace member.');
    //check if member role is not admin
    if (member.role !== 'ADMIN') {
      //check if member user is equal current user, member can leave. otherwise throw error.
      if (existingMember.userId === userId) {
        await this.prisma.workspaceMember.delete({ where: { id } });
        return 'Left from workspace successfully!';
      } else {
        throw new ForbiddenException(
          "You can't remove member. because you don't have permission.",
        );
      }
    }
    //admin can only all member
    await this.prisma.workspaceMember.delete({ where: { id } });
    return 'Remove Member successfully!';
  }
}
