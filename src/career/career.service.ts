import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { ConversationRepository } from './repositories/conversation.repository';
import { ChatCompletionMessageParam } from 'openai/resources';
import { PrismaService } from 'src/prisma.service';
import { MessageRepository } from './repositories/message.repository';
@Injectable()
export class CareerService {
  private conversationHistory: Map<
    string,
    Array<{ role: string; content: string }>
  > = new Map();

  constructor(
    private openAIService: OpenAIService,
    private conversationRepository: ConversationRepository,
    private messageRepository: MessageRepository,
    private prisma: PrismaService,
  ) {}
  private initializeConversation(): {
    role: string;
    content: string;
  }[] {
    return [
      {
        role: 'system',
        content: `You are a career counselor bot. Ask about education, skills, interests, and experience. Provide specific career recommendations and relevant courses.`,
      },
    ];
  }
  async handleMessage(phoneNumber: string, messageContent: string) {
    let conversation = await this.prisma.conversation.findUnique({
      where: { phoneNumber },
      include: { Message: true },
    });

    // Convert messages to plain objects for Prisma
    const initialMessages = this.initializeConversation().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          phoneNumber,
          Message: {
            create: {
              role: 'system',
              content: `You are a career counselor bot. Ask about education, skills, interests, and experience. Provide specific career recommendations and relevant courses.`,
            },
          },
        },
        include: { Message: true },
      });
    }
    // Add user message
    await this.prisma.message.create({
      data: {
        role: 'user',
        content: messageContent,
        conversationId: conversation.id,
      },
    });

    // Format messages for OpenAI
    const messages: ChatCompletionMessageParam[] = conversation.Message.map(
      (msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      }),
    );
    messages.push({ role: 'user', content: messageContent });

    // Get AI response
    const response = await this.openAIService.generateResponse(messages);

    // Save AI response
    await this.prisma.message.create({
      data: {
        role: 'assistant',
        content: response,
        conversationId: conversation.id,
      },
    });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return response;
  }

  async getConversationHistory(phoneNumber: string) {
    return this.prisma.conversation.findUnique({
      where: { phoneNumber },
      include: {
        Message: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async deleteConversation(phoneNumber: string) {
    return this.prisma.conversation.delete({
      where: { phoneNumber },
    });
  }
}
