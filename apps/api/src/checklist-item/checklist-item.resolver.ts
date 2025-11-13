import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ChecklistItemService } from './checklist-item.service';

import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';
import { ChecklistItem } from './entities/checklist-item.enitity';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => ChecklistItem)
export class ChecklistItemResolver {
  constructor(private readonly checklistItemService: ChecklistItemService) {}

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => ChecklistItem)
  createChecklistItem(
    @Args('createChecklistItemInput')
    createChecklistItemInput: CreateChecklistItemInput,
    @Args('boardId') boardId: string,
  ) {
    return this.checklistItemService.create(
      createChecklistItemInput,

      boardId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Query(() => [ChecklistItem], { name: 'checklistItems' })
  findAll(
    @Args('checklistId') checklistId: string,
    @Args('boardId') boardId: string,
  ) {
    return this.checklistItemService.findAll(checklistId, boardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => ChecklistItem)
  updateChecklistItem(
    @Args('updateChecklistItemInput')
    updateChecklistItemInput: UpdateChecklistItemInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.checklistItemService.update(
      updateChecklistItemInput.id,
      updateChecklistItemInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => String)
  removeChecklistItem(
    @Args('id') id: string,
    @Args('boardId') boardId: string,
  ) {
    return this.checklistItemService.remove(id, boardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => String)
  removeAssignedMemberFromChecklistItem(
    @Args('id') id: string,
    @Args('memberId') memberId: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.checklistItemService.removeAssignedMember(
      id,
      memberId,
      boardId,
      userId,
    );
  }
  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => String)
  addAssignMemberInChecklistItem(
    @Args('id') id: string,
    @Args('memberId') memberId: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.checklistItemService.addAssignMember(
      id,
      memberId,
      boardId,
      userId,
    );
  }
}
