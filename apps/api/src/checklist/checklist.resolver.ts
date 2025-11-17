import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ChecklistService } from './checklist.service';
import { Checklist } from './entities/checklist.entity';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => Checklist)
export class ChecklistResolver {
  constructor(private readonly checklistService: ChecklistService) {}

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => Checklist)
  createChecklist(
    @Args('createChecklistInput') createChecklistInput: CreateChecklistInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.checklistService.create(createChecklistInput, userId, boardId);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [Checklist], { name: 'getAllChecklistByBoardId' })
  findAllByBoardId(@Args('boardId') boardId: string) {
    return this.checklistService.findAllByBoardId(boardId);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [Checklist], { name: 'checklists' })
  findAll(@Args('cardId') cardId: string) {
    return this.checklistService.findAll(cardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => Checklist)
  duplicateChecklist(
    @Args('checklistId') checklistId: string,
    @Args('createChecklistInput') createChecklistInput: CreateChecklistInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.checklistService.duplicate(
      checklistId,
      createChecklistInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => Checklist)
  updateChecklist(
    @Args('updateChecklistInput') updateChecklistInput: UpdateChecklistInput,
    @Context() context: any,
    @Args('boardId') boardId: string,
  ) {
    const userId = context.req.user.id;
    return this.checklistService.update(
      updateChecklistInput.id,
      updateChecklistInput,
      userId,
      boardId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => String)
  removeChecklist(
    @Args('id') id: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.checklistService.remove(id, userId, boardId);
  }
}
