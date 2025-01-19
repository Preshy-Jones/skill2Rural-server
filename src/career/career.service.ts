import { Injectable } from "@nestjs/common";
import { OpenAIService } from "src/openai/openai.service";
import { ConversationRepository } from "./repositories/conversation.repository";
import { ChatCompletionMessageParam } from "openai/resources";
import { PrismaService } from "src/prisma.service";
import { MessageRepository } from "./repositories/message.repository";
@Injectable()
export class CareerService {
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
  private readonly CONVERSATION_STATES = {
    INITIAL: "initial",
    INTERESTS: "interests",
    SKILLS: "skills",
    CHALLENGES: "challenges",
    ASPIRATIONS: "aspirations",
    RECOMMENDATIONS: "recommendations",
  };
  constructor(
    private openAIService: OpenAIService,
    private conversationRepository: ConversationRepository,
    private messageRepository: MessageRepository,
    private prisma: PrismaService,
  ) {}

  async handleMessage(phoneNumber: string, messageContent: string) {
    await this.cleanExpiredSessions(phoneNumber);

    let conversation = await this.getOrCreateConversation(phoneNumber);
    const currentState = await this.determineConversationState(conversation);

    // Add user message
    await this.prisma.message.create({
      data: {
        role: "user",
        content: messageContent,
        conversationId: conversation.id,
      },
    });

    // Generate appropriate response based on conversation state
    const response = await this.generateStateBasedResponse(
      currentState,
      messageContent,
      conversation,
    );

    // Save AI response
    await this.prisma.message.create({
      data: {
        role: "assistant",
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

  private async getOrCreateConversation(phoneNumber: string) {
    let conversation = await this.prisma.conversation.findUnique({
      where: {
        phoneNumber,
        isActive: true,
        lastMessageAt: {
          gte: new Date(Date.now() - this.SESSION_TIMEOUT),
        },
      },
      include: { Message: true },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          phoneNumber,
          Message: {
            create: {
              role: "system",
              content: `You are Rafiki, a friendly career counselor bot. You guide users through a conversation about their career interests and aspirations. You ask one question at a time and wait for responses. You maintain a warm, encouraging tone and provide specific examples to help users understand what you're asking.`,
            },
          },
        },
        include: { Message: true },
      });
    }

    return conversation;
  }

  private async determineConversationState(conversation: any) {
    const messages = conversation.Message;
    const messageCount = messages.filter((m) => m.role !== "system").length;

    // Simple state determination based on message count
    // In a production environment, you might want to use a more sophisticated approach
    if (messageCount <= 1) return this.CONVERSATION_STATES.INITIAL;
    if (messageCount <= 3) return this.CONVERSATION_STATES.INTERESTS;
    if (messageCount <= 5) return this.CONVERSATION_STATES.SKILLS;
    if (messageCount <= 7) return this.CONVERSATION_STATES.CHALLENGES;
    if (messageCount <= 9) return this.CONVERSATION_STATES.ASPIRATIONS;
    return this.CONVERSATION_STATES.RECOMMENDATIONS;
  }

  private async generateStateBasedResponse(
    state: string,
    userMessage: string,
    conversation: any,
  ): Promise<string> {
    const statePrompts = {
      [this.CONVERSATION_STATES.INITIAL]:
        `Hi there! My name is Rafiki, and I'm your career buddy 😊 I'm so excited to meet you and help you figure out what you might love to do. Let's start by talking about the things you like the most. What's something you really enjoy or always have fun doing?

Hint: What do you love to do and get really excited about? Is there something you always pay attention to, like drawing, playing games, or learning about something fun?`,

      [this.CONVERSATION_STATES.INTERESTS]:
        `Great to learn about your interests! Now tell me what are you really good at? Maybe you're great at solving puzzles, or telling stories. Is there something at school or home that feels easy and fun for you?

Hint: What are your friends or family say you're awesome at? What's something you can do easily without trying too hard?`,

      [this.CONVERSATION_STATES.SKILLS]:
        `Wonderful! Now, I'd love to understand if there's anything you find challenging. Is there anything that makes some things hard for you to do?

Hint: It's okay to share what feels tricky - everyone has things they're still learning or practicing to get better at. 😊`,

      [this.CONVERSATION_STATES.CHALLENGES]:
        `Thank you for sharing that. I'm curious to learn what you want to do that makes the world better? For example, do you want to help people, make something cool, or solve problems?

Hint: What's your big idea for making things better? 🌍✨`,

      [this.CONVERSATION_STATES.ASPIRATIONS]:
        await this.generateCareerRecommendations(conversation),
    };

    return (
      statePrompts[state] ||
      "I'm processing everything you've shared with me. Would you like to hear my career recommendations?"
    );
  }

  private async generateCareerRecommendations(
    conversation: any,
  ): Promise<string> {
    const messages = conversation.Message.map((msg) => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
    }));

    messages.push({
      role: "system",
      content:
        "Based on all the information shared, provide 2-3 specific career recommendations. Include why each career might be a good fit and suggest one specific next step for each career path.",
    });

    return this.openAIService.generateResponse(messages);
  }

  async getConversationHistory(phoneNumber: string) {
    return this.prisma.conversation.findUnique({
      where: { phoneNumber },
      include: {
        Message: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async deleteConversation(phoneNumber: string) {
    return this.prisma.conversation.delete({
      where: { phoneNumber },
    });
  }

  private async cleanExpiredSessions(phoneNumber: string) {
    const expiryDate = new Date(Date.now() - this.SESSION_TIMEOUT);

    await this.prisma.conversation.updateMany({
      where: {
        isActive: true,
        lastMessageAt: {
          lt: expiryDate,
        },
        phoneNumber,
      },
      data: {
        isActive: false,
      },
    });
  }
}
