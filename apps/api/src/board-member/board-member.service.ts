import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardMemberInput } from './dto/create-board-member.input';
import { UpdateBoardMemberInput } from './dto/update-board-member.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class BoardMemberService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBoardMemberInput: CreateBoardMemberInput) {
    return 'This action adds a new boardMember';
  }

  async findAll(boardId: string) {
    const boardMembers = await this.prisma.boardMember.findMany({
      where: {
        boardId,
      },
      include: {
        user: true,
      },
    });
    return boardMembers.map((b) => ({
      ...b,
      user: { ...b.user, fullName: `${b.user.firstName} ${b.user.lastName}` },
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} boardMember`;
  }

  async update(
    id: string,
    updateBoardMemberInput: UpdateBoardMemberInput,
    userId: string,
    boardId: string,
  ) {
    const existingMember = await this.prisma.boardMember.findUnique({
      where: {
        id,
      },
    });
    if (!existingMember) {
      throw new BadRequestException('Invalid member id');
    }
    if (existingMember.userId === userId) {
      throw new ForbiddenException("You can't update your self member.");
    }

    const userMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userId,
      },
    });

    if (!userMember) throw new UnauthorizedException();

    if (
      userMember.role === 'MEMBER' &&
      updateBoardMemberInput.role === 'ADMIN'
    ) {
      throw new ForbiddenException();
    }

    if (userMember.role === 'MEMBER' && existingMember.role === 'MEMBER') {
      throw new ForbiddenException('Same member role not allowed!');
    }

    const updatedBoardMember = await this.prisma.boardMember.update({
      where: { id },
      data: {
        role: updateBoardMemberInput.role as Role,
      },
    });

    return updatedBoardMember;
  }

  remove(id: number) {
    return `This action removes a #${id} boardMember`;
  }
}
