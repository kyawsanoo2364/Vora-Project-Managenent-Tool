import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';
import { AssignMemberCardInput } from './dto/assign-member-card.input';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => Card)
  createCard(
    @Args('createCardInput') createCardInput: CreateCardInput,
    //boardId is required to check board permissions.
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.cardService.create(createCardInput, boardId, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [Card])
  getCardsByListId(@Args('listId') listId: string) {
    return this.cardService.findByListId(listId);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => Card)
  getCardById(@Args('id') id: string) {
    return this.cardService.findById(id);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => String)
  getBoardIdFromCard(@Args('cardId') cardId: string) {
    return this.cardService.getBoardIdFromCard(cardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => Card)
  updateCard(
    @Args('boardId') boardId: string,
    @Args('updateCardInput') updateCardInput: UpdateCardInput,
    @Context() context: any,
  ) {
    return this.cardService.update(
      updateCardInput.id,
      updateCardInput,
      context.req.user.id,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Query(() => [BoardMember])
  getAssignedMemberInCard(
    @Args('cardId') cardId: string,
    @Args('boardId') boardId: string,
  ) {
    return this.cardService.getAssignedMember(cardId, boardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => String)
  addAssignMemberInCard(
    @Args('assignMemberCardInput') assignMemberCardInput: AssignMemberCardInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.cardService.addAssignMember(
      assignMemberCardInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => String)
  removeAssignMemberInCard(
    @Args('assignMemberCardInput') assignMemberCardInput: AssignMemberCardInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.cardService.removeAssignMember(
      assignMemberCardInput,
      boardId,
      userId,
    );
  }
}
