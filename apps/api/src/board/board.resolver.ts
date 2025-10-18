import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';

@Resolver(() => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => Board)
  createBoard(@Args('createBoardInput') createBoardInput: CreateBoardInput) {
    return this.boardService.create(createBoardInput);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [Board], { name: 'getAllBoards' })
  findAll(@Args('workspaceId') workspaceId: string) {
    return this.boardService.findAll(workspaceId);
  }
}
