import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBoardInput: CreateBoardInput) {
    const existingWorkspace = await this.prisma.workspace.findUnique({
      where: { id: createBoardInput.workspaceId },
    });
    if (!existingWorkspace) {
      throw new BadRequestException(
        'Cannot create board.Invalid workspace Id or Your workspace has already deleted before.',
      );
    }
    try {
      const newBoard = await this.prisma.board.create({
        data: {
          name: createBoardInput.name,
          background: createBoardInput.background,
          description: createBoardInput.description,
          workspaceId: createBoardInput.workspaceId,
        },
      });

      return newBoard;
    } catch (error) {
      throw new RequestTimeoutException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAll(workspaceId: string) {
    const boards = await this.prisma.board.findMany({
      where: {
        workspaceId,
      },
      include: {
        workspace: true,
      },
    });

    return boards;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardInput: UpdateBoardInput) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
