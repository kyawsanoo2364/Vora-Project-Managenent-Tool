import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ReactionToCommentService } from './reaction-to-comment.service';
import { ReactionToComment } from './entities/reaction-to-comment.entity';
import { CreateReactionToCommentInput } from './dto/create-reaction-to-comment.input';
import { UpdateReactionToCommentInput } from './dto/update-reaction-to-comment.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';
import { ReactionsWithGroup } from './entities/reactionsWithGroup.enitity';

@Resolver(() => ReactionToComment)
export class ReactionToCommentResolver {
  constructor(
    private readonly reactionToCommentService: ReactionToCommentService,
  ) {}

  @UseGuards(JWTAuthGuard)
  @Query(() => [ReactionsWithGroup])
  getAllReactions(
    @Args('commentId') commentId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.reactionToCommentService.findAll(commentId, userId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => ReactionToComment)
  createReaction(
    @Args('createReactionToCommentInput')
    createReactionToCommentInput: CreateReactionToCommentInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.reactionToCommentService.create(
      createReactionToCommentInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => ReactionToComment)
  removeReaction(
    @Args('reactionId')
    reactionId: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.reactionToCommentService.remove(reactionId, boardId, userId);
  }
}
