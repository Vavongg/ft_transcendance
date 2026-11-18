import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  message: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, content: 'test' }),
  },
};

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        // { // pour lancer avec un faux prisma en test
        //   provide: PrismaService,
        //   useValue: mockPrismaService,
        // },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('enregistre un message et le renvoie dans l’historique', () => {
    const message = service.createMessage('Spheal', 'Bâââââ <3');

    expect(message.id).toBe(1);
    expect(service.history()).toEqual([message]);
  });
});
