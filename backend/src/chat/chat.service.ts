import { Injectable } from '@nestjs/common';

type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
};

@Injectable()
export class ChatService {
    private readonly messages: ChatMessage[] = [];
    private nextId = 1;

    createMessage(sender: string, content: string): ChatMessage {
        const message = {
          id: this.nextId++,
          sender,
          content,
          createdAt: new Date().toISOString(),
        };
        this.messages.push(message);
        if (this.messages.length > 100) 
            this.messages.shift();
        return message;
    }

    history(): ChatMessage[] {
        return [...this.messages];
    }
}
