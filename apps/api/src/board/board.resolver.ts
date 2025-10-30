import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';

import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { ToggleStarredBoardInput } from './dto/toggle-starred-board.input';
import { Paginated } from 'src/common/pagination/paginate.type';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { PaginatedBoard } from './types/paginated-board.type';
import { timeStamp } from 'console';
import { UpdateBoardInput } from './dto/update-board.input';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Context() context,
  ) {
    const userId = context.req.user.id;
    return this.boardService.create(createBoardInput, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => PaginatedBoard, { name: 'getAllBoards' })
  findAll(
    @Context() context,
    @Args('workspaceId') workspaceId: string,
    @Args() paginationArgs: PaginationArgs,
    @Args('sort', { nullable: true }) sort?: string,
    @Args('search', { nullable: true }) search?: string,
  ) {
    const userId = context.req.user.id;
    return this.boardService.findAll(
      workspaceId,
      userId,
      paginationArgs,
      sort,
      search,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Query(() => Board, { name: 'getBoard' })
  findOne(@Args('boardId') boardId: string) {
    return this.boardService.findOne(boardId);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => String)
  toggleStarredBoard(
    @Context() context,
    @Args('toggleStarredBoardInput')
    toggleStarredBoardInput: ToggleStarredBoardInput,
  ) {
    const userId = context.req.user.id;
    return this.boardService.toggleStarredBoard(
      toggleStarredBoardInput,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => Board)
  updateBoard(@Args('updateBoardInput') updateBoardInput: UpdateBoardInput) {
    return this.boardService.updateBoard(updateBoardInput.id, updateBoardInput);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [Board])
  findStarredBoards(
    @Context() context,
    @Args('workspaceId') workspaceId: string,
  ) {
    const userId = context.req.user.id;
    return this.boardService.findStarredBoards(workspaceId, userId);
  }
}
