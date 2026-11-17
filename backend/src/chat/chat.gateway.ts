import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({cors: {origin:'*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor (private ChatService: ChatService){}
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const {userId, username} = client.handshake.auth;
         if (typeof userId !== 'number' || typeof username !== 'string') {
            client.disconnect();
            return;
        }
        client.data.user = { userId, username };
        client.join('general');

        console.log(`Client connecté : ${client.id} ${username}`);
        client.emit('chat:history', this.ChatService.history());
        this.server.to('general').emit('notification', `${username} a rejoint le chat`);
    }
    handleDisconnect(client: Socket) {
        const username = client.data.user?.username ?? client.id;
        console.log(`Client déconnecté : ${username}`);
        this.server.to('general').emit('notification', `${username} a quitté le chat`);
    }
    @SubscribeMessage('chat:send')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: CreateMessageDto
    ){
        const content = dto.content?.trim();
        if (!content || content.length > 1000) {
            client.emit('chat:error', {
                code: 'INVALID_MESSAGE',
                message: 'Message vide ou trop long (1000 max)',
            });
            return;
        }
        const message = this.ChatService.createMessage(client.data.user.username, content);
        this.server.to('general').emit('chat:message', message);
    }
}