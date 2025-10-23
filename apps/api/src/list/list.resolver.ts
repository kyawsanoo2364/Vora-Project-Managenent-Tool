import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';

@Resolver(() => List)
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JWTAuthGuard)
  @Mutation(() => List)
  createList(@Args('createListInput') createListInput: CreateListInput) {
    return this.listService.create(createListInput);
  }

  @UseGuards(JWTAuthGuard)
  @Query(() => [List], { name: 'list' })
  findAll(@Args('boardId') boardId: string) {
    return this.listService.findAll(boardId);
  }

  @UseGuards(JWTAuthGuard)
  @Mutation(() => List)
  updateList(@Args('updateListInput') updateListInput: UpdateListInput) {
    return this.listService.update(updateListInput.id, updateListInput);
  }

  @Mutation(() => List)
  removeList(@Args('id', { type: () => Int }) id: number) {
    return this.listService.remove(id);
  }
}
