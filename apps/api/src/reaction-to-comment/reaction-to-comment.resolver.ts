import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReactionToCommentService } from './reaction-to-comment.service';
import { ReactionToComment } from './entities/reaction-to-comment.entity';
import { CreateReactionToCommentInput } from './dto/create-reaction-to-comment.input';
import { UpdateReactionToCommentInput } from './dto/update-reaction-to-comment.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => ReactionToComment)
export class ReactionToCommentResolver {
  constructor(
    private readonly reactionToCommentService: ReactionToCommentService,
  ) {}

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => ReactionToComment)
  createReaction(
    @Args('createReactionToCommentInput')
    createReactionToCommentInput: CreateReactionToCommentInput,
    @Args('boardId') boardId: string,
  ) {
    return this.reactionToCommentService.create(
      createReactionToCommentInput,
      boardId,
    );
  }
}
