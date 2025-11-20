import { Injectable } from '@nestjs/common';
import { CreateReactionToCommentInput } from './dto/create-reaction-to-comment.input';
import { UpdateReactionToCommentInput } from './dto/update-reaction-to-comment.input';

@Injectable()
export class ReactionToCommentService {
  async create(
    createReactionToCommentInput: CreateReactionToCommentInput,
    boardId: string,
  ) {
    return 'This action adds a new reactionToComment';
  }

  remove(id: string) {
    return `This action removes a #${id} reactionToComment`;
  }
}
