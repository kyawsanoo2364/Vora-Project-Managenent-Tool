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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
