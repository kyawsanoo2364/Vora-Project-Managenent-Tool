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
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoardMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async create(
    createBoardMemberInput: CreateBoardMemberInput,
    boardId: string,
    currentUserId: string,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: createBoardMemberInput.userId },
    });
    if (!existingUser)
      throw new BadRequestException(
        'User not found in Vora. Please Sign up or invite this user with email.',
      );
    // current logged in user
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });
    if (!currentUser) throw new UnauthorizedException();

    const existingMember = await this.prisma.boardMember.findFirst({
      where: {
        userId: createBoardMemberInput.userId,
        boardId: boardId,
      },
    });
    if (existingMember)
      throw new BadRequestException('user has already joined board member.');

    const newMember = await this.prisma.boardMember.create({
      data: {
        ...createBoardMemberInput,
        boardId,
      },
      include: {
        board: true,
      },
    });

    try {
      await this.emailService.sendBoardInvitation(existingUser.email, {
        boardName: newMember.board.name,
        adminName: `${currentUser.firstName} ${currentUser.lastName}`,
        boardUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/b/${boardId}`,
        logoUrl: this.configService.get('APP_LOGO_URL')!,
        adminEmail: currentUser.email,
      });
    } catch (error) {
      console.log(error);
    }

    return newMember;
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

  async remove(id: string, userId: string) {
    //get for delete member info
    const existingBoardMember = await this.prisma.boardMember.findUnique({
      where: { id },
    });
    //check if already or not!
    if (!existingBoardMember)
      throw new BadRequestException(
        'This member is not exists or already removed.',
      );

    // get current logged in user board member.
    const member = await this.prisma.boardMember.findFirst({
      where: {
        boardId: existingBoardMember.boardId,
        userId,
      },
    });
    if (!member) throw new ForbiddenException('You are not this board member.');
    //if member role is admin, can delete all members.
    if (member.role === 'ADMIN') {
      await this.prisma.boardMember.delete({ where: { id } });
    } else {
      //if member is member or viewer,they can only delete their self.

      //check current logged in user is equal delete user member
      if (existingBoardMember.userId === userId) {
        await this.prisma.boardMember.delete({ where: { id } });
      } else {
        throw new ForbiddenException(
          'You only your self leave from this board.',
        );
      }
    }
    return 'Successfully! removed member or left.';
  }
}
