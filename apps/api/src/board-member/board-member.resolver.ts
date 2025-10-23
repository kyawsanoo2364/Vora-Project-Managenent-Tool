import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { BoardMemberService } from './board-member.service';
import { BoardMember } from './entities/board-member.entity';
import { CreateBoardMemberInput } from './dto/create-board-member.input';
import { UpdateBoardMemberInput } from './dto/update-board-member.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => BoardMember)
export class BoardMemberResolver {
  constructor(private readonly boardMemberService: BoardMemberService) {}

  @Mutation(() => BoardMember)
  createBoardMember(
    @Args('createBoardMemberInput')
    createBoardMemberInput: CreateBoardMemberInput,
  ) {
    return this.boardMemberService.create(createBoardMemberInput);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [BoardMember], { name: 'boardMembers' })
  findAll(@Args('boardId') boardId: string) {
    return this.boardMemberService.findAll(boardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @Mutation(() => BoardMember)
  @BoardRole('ADMIN', 'MEMBER')
  updateBoardMember(
    @Args('updateBoardMemberInput')
    updateBoardMemberInput: UpdateBoardMemberInput,
    @Context() context,
    @Args('boardId') boardId: string,
  ) {
    const userId = context.req.user.id;
    return this.boardMemberService.update(
      updateBoardMemberInput.id,
      updateBoardMemberInput,
      userId,
      boardId,
    );
  }

  @Mutation(() => BoardMember)
  removeBoardMember(@Args('id', { type: () => Int }) id: number) {
    return this.boardMemberService.remove(id);
  }
}
