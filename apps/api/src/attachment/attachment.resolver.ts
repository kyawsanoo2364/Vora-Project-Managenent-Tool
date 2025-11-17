import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AttachmentService } from './attachment.service';
import { AttachmentEntity } from './entities/attachment.entity';

import { UpdateAttachmentInput } from './dto/update-attachment.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guard/guard.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Resolver(() => AttachmentEntity)
export class AttachmentResolver {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Query(() => [AttachmentEntity], { name: 'attachment' })
  findAll() {
    return this.attachmentService.findAll();
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => AttachmentEntity)
  updateAttachment(
    @Args('updateAttachmentInput') updateAttachmentInput: UpdateAttachmentInput,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.attachmentService.update(
      updateAttachmentInput.id,
      updateAttachmentInput,
      boardId,
      userId,
    );
  }

  @UseGuards(JWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @Mutation(() => AttachmentEntity)
  removeAttachment(
    @Args('id') id: string,
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return this.attachmentService.remove(id, boardId, userId);
  }
}
