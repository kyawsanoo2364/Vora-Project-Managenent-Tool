import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { MediaModule } from './media/media.module';
import { BoardModule } from './board/board.module';
import { ListModule } from './list/list.module';
import { BoardMemberModule } from './board-member/board-member.module';
import { RedisModule } from './common/redis/redis.module';
import { InviteLinkModule } from './invite-link/invite-link.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { EmailModule } from './email/email.module';
import { CardModule } from './card/card.module';
import { ActivityModule } from './activity/activity.module';
import { ChecklistModule } from './checklist/checklist.module';
import { CommentModule } from './comment/comment.module';
import { ChecklistItemModule } from './checklist-item/checklist-item.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/graphql/schema.gql',
    }),
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    WorkspaceModule,
    MediaModule,
    BoardModule,
    ListModule,
    BoardMemberModule,
    // RedisModule,
    InviteLinkModule,
    WorkspaceMemberModule,
    EmailModule,
    CardModule,
    ActivityModule,
    ChecklistModule,
    CommentModule,
    ChecklistItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
