import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateBoardInput } from './dto/create-board.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { board, Role } from '@prisma/client';
import { ToggleStarredBoardInput } from './dto/toggle-starred-board.input';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { paginateQuery } from 'src/common/pagination/pagination.helper';
import { Board } from './entities/board.entity';
import { LIST_DEFAULT_DATA } from 'src/utils/constants';
import { ListService } from 'src/list/list.service';
import { UpdateBoardInput } from './dto/update-board.input';

@Injectable()
export class BoardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listService: ListService,
  ) {}

  async create(createBoardInput: CreateBoardInput, userId: string) {
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
          members: {
            create: {
              userId,
              role: Role.ADMIN,
            },
          },
        },
      });

      for (const list of LIST_DEFAULT_DATA) {
        await this.listService.create({ boardId: newBoard.id, name: list });
      }

      return newBoard;
    } catch (error) {
      throw new RequestTimeoutException(
        error.message || 'Something went wrong',
      );
    }
  }

  async findAll(
    workspaceId: string,
    userId: string,
    paginationArgs: PaginationArgs,
    sort?: string,
    search?: string,
  ) {
    const sortOptions: Record<string, any> = {
      most_recently: { updatedAt: 'desc' },
      least_recently: { updatedAt: 'asc' },
      a_to_z: { name: 'asc' },
      z_to_a: { name: 'desc' },
    };

    const orderBy = sort ? sortOptions[sort] : { updatedAt: 'desc' };
    let where = {
      workspaceId,
      members: {
        some: {
          userId,
        },
      },
    };

    if (search && search.length > 0)
      where['name'] = {
        contains: search,
      };
    const data = await paginateQuery<Board>(this.prisma, this.prisma.board, {
      cursor: paginationArgs.cursor,
      take: paginationArgs.take,
      where,
      include: {
        workspace: true,
        starred: {
          where: {
            userId,
          },
        },
      },
      orderBy,
    });

    return data;
  }

  public async findOne(boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      ...board,
      members: board?.members.map((m) => ({
        id: m.id,
        role: m.role,
        user: { ...m.user, fullName: `${m.user.firstName} ${m.user.lastName}` },
      })),
    };
  }

  public async updateBoard(id: string, updateBoardInput: UpdateBoardInput) {
    const updatedBoard = await this.prisma.board.update({
      where: {
        id,
      },
      data: {
        ...updateBoardInput,
      },
    });
    return updatedBoard;
  }

  public async findStarredBoards(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        starredBoards: {
          where: {
            userId,
          },
          include: {
            board: true,
          },
        },
      },
    });
    if (!workspace) {
      throw new BadRequestException('Invalid workspace Id.');
    }
    const starredBoards: board[] = workspace.starredBoards?.map((b) => b.board);

    return starredBoards;
  }

  public async toggleStarredBoard(
    toggleStarredBoardInput: ToggleStarredBoardInput,
    userId: string,
  ) {
    const existingBoard = await this.prisma.board.findUnique({
      where: { id: toggleStarredBoardInput.boardId },
    });

    if (!existingBoard) {
      throw new BadRequestException('Invalid Board Id.');
    }

    const existingStarred = await this.prisma.starredBoard.findFirst({
      where: {
        workspaceId: toggleStarredBoardInput.workspaceId,

        boardId: toggleStarredBoardInput.boardId,
        userId,
      },
    });
    if (!existingStarred) {
      await this.prisma.starredBoard.create({
        data: {
          workspaceId: toggleStarredBoardInput.workspaceId,
          boardId: toggleStarredBoardInput.boardId,
          userId,
        },
      });
      return 'Board added to favorite';
    }
    await this.prisma.starredBoard.delete({
      where: {
        id: existingStarred.id,
      },
    });

    return 'Board removed from favorite';
  }
}
