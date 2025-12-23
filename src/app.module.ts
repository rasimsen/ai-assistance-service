import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConversationsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
