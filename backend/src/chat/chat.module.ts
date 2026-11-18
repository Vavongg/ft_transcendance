import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway'; // 👈 Ton Gateway
import { ChatService } from './chat.service';   // 👈 Ton Service (pour Prisma)
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, ChatService], // On les déclare TOUS LES DEUX ici !
  exports: [ChatService],
})
export class ChatModule {}