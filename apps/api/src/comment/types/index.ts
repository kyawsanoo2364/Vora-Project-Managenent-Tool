import { Comment } from '../entities/comment.entity';
import { Paginated } from 'src/common/pagination/paginate.type';
import { ReplyComment } from '../entities/reply-comment.entity';

export const PaginatedComment = Paginated(Comment);

export const PaginatedReplies = Paginated(ReplyComment);
