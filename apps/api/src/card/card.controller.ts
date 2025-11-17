import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CardService } from './card.service';
import { RestJWTAuthGuard } from 'src/auth/guard/rest-auth.guard';
import { BoardPermissionGuard } from 'src/common/board-permission/role.guard';
import { BoardRole } from 'src/common/board-permission/board.role.decorator';

@Controller('api/boards/:boardId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get(':cardId/attachment/upload')
  get(@Param('cardId') cardId: string) {
    return 'Hello test' + cardId;
  }

  @Post(':cardId/attachment/upload')
  @UseGuards(RestJWTAuthGuard, BoardPermissionGuard)
  @BoardRole('ADMIN', 'MEMBER')
  @UseInterceptors(FileInterceptor('file'))
  addAttachmentFile(
    @Param('cardId') cardId: string,
    @Param('boardId') boardId: string,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.cardService.addAttachmentFile(cardId, file, userId, boardId);
  }
}
