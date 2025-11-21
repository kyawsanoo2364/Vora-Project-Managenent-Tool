import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';
import { ReplyComment } from './entities/reply-comment.entity';
import { CreateReplyCommentInput } from './dto/create-reply-comment.input';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { Paginated } from 'src/common/pagination/paginate.type';
import { PaginatedComment, PaginatedReplies } from './types';
import { UpdateReplyCommentInput } from './dto/update-reply-comment.input';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.create(createCommentInput, boardId, userId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => ReplyComment)
  createReplyComment(
    @Args('createReplyCommentInput')
    createReplyCommentInput: CreateReplyCommentInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.createReplyComment(
      createReplyCommentInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Query(() => PaginatedComment, { name: 'comments' })
  findAll(
    @Args('cardId') cardId: string,
    @Args('boardId') boardId: string,
    @Args() paginationArgs: PaginationArgs,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.findAll(cardId, boardId, paginationArgs, userId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Query(() => PaginatedReplies, { name: 'replyComments' })
  findAllReplies(
    @Args('commentId') commentId: string,
    @Args('boardId') boardId: string,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.commentService.findAllReplies(
      commentId,
      boardId,
      paginationArgs,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.updateComment(
      updateCommentInput.id,
      updateCommentInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => Comment)
  updateReplyComment(
    @Args('updateReplyCommentInput')
    updateReplyCommentInput: UpdateReplyCommentInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.updateReplyComment(
      updateReplyCommentInput.id,
      updateReplyCommentInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => Comment)
  removeComment(
    @Args('id') id: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.removeComment(id, userId, boardId);
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER', 'VIEWER')
  @Mutation(() => ReplyComment)
  removeReplyComment(
    @Args('id') id: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.commentService.removeReplyComment(id, userId, boardId);
  }
}
