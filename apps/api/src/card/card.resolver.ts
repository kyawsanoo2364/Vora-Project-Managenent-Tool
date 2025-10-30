import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

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
    return this.cardService.create(createCardInput, userId);
  }

  @Query(() => [Card], { name: 'card' })
  findAll() {
    return this.cardService.findAll();
  }

  @Query(() => Card, { name: 'card' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cardService.findOne(id);
  }

  @Mutation(() => Card)
  updateCard(@Args('updateCardInput') updateCardInput: UpdateCardInput) {
    return this.cardService.update(updateCardInput.id, updateCardInput);
  }

  @Mutation(() => Card)
  removeCard(@Args('id', { type: () => Int }) id: number) {
    return this.cardService.remove(id);
  }
}
