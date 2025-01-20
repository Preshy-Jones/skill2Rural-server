import { Injectable } from "@nestjs/common";
import { OpenAIService } from "src/openai/openai.service";
import { ConversationRepository } from "./repositories/conversation.repository";
import { ChatCompletionMessageParam } from "openai/resources";
import { PrismaService } from "src/prisma.service";
import { MessageRepository } from "./repositories/message.repository";

interface ConversationState {
  currentState: string;
  stateData: {
    [key: string]: {
      completed: boolean;
      data: any;
      lastUpdated: Date;
    };
  };
}

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

  private readonly STATE_REQUIREMENTS = {
    [this.CONVERSATION_STATES.INITIAL]: {
      requiredKeywords: ["hi", "hello", "hey", "start", "begin"],
      minMessageLength: 1,
    },
    [this.CONVERSATION_STATES.INTERESTS]: {
      requiredKeywords: [
        "like",
        "enjoy",
        "love",
        "fun",
        "interest",
        "hobby",
        "passionate",
      ],
      minMessageLength: 10,
      requiredResponseCount: 1,
    },
    [this.CONVERSATION_STATES.SKILLS]: {
      requiredKeywords: [
        "good at",
        "skill",
        "can",
        "able",
        "capable",
        "excel",
        "best at",
      ],
      minMessageLength: 15,
      requiredResponseCount: 1,
    },
    [this.CONVERSATION_STATES.CHALLENGES]: {
      requiredKeywords: [
        "challenge",
        "difficult",
        "hard",
        "struggle",
        "trying",
        "learning",
      ],
      minMessageLength: 15,
      requiredResponseCount: 1,
    },
    [this.CONVERSATION_STATES.ASPIRATIONS]: {
      requiredKeywords: [
        "want",
        "hope",
        "dream",
        "future",
        "goal",
        "plan",
        "aspire",
      ],
      minMessageLength: 15,
      requiredResponseCount: 1,
    },
  };
  constructor(
    private openAIService: OpenAIService,
    private conversationRepository: ConversationRepository,
    private messageRepository: MessageRepository,
    private prisma: PrismaService,
  ) {}

  async handleMessage(phoneNumber: string, messageContent: string) {
    try {
      // Start a Prisma transaction to ensure data consistency
      return await this.prisma.$transaction(async (prisma) => {
        // Clean expired sessions
        await this.cleanExpiredSessions(phoneNumber);

        // Get or create conversation
        let conversation = await this.getOrCreateConversation(phoneNumber);

        // Determine current conversation state
        const conversationState =
          await this.determineConversationState(conversation);

        // Log incoming message
        await this.logMessage(conversation.id, "user", messageContent);

        // Process message based on state
        const response = await this.processMessageByState(
          conversation,
          messageContent,
          conversationState,
        );

        // Log assistant response
        await this.logMessage(conversation.id, "assistant", response);

        // Update conversation timestamp
        await this.updateConversationTimestamp(conversation.id);

        return response;
      });
    } catch (error) {
      this.logger.error(
        `Error handling message: ${error.message}`,
        error.stack,
      );
      return "I apologize, but I'm having trouble processing your message right now. Could you please try again?";
    }
  }

  private async logMessage(
    conversationId: number,
    role: string,
    content: string,
  ) {
    await this.prisma.message.create({
      data: {
        role,
        content,
        conversationId,
      },
    });
  }

  private async updateConversationTimestamp(conversationId: number) {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });
  }

  private async processMessageByState(
    conversation: any,
    messageContent: string,
    conversationState: ConversationState,
  ): Promise<string> {
    const { currentState } = conversationState;

    // Get all messages for context
    const conversationHistory = await this.getConversationHistory(
      conversation.id,
    );

    // Format messages for OpenAI
    const messages: ChatCompletionMessageParam[] = [
      // System message with current state context
      {
        role: "system",
        content: this.getSystemPromptForState(
          currentState,
          conversationState.stateData,
        ),
      },
      // Previous messages for context
      ...this.formatMessagesForContext(conversationHistory),
      // Current user message
      {
        role: "user",
        content: messageContent,
      },
    ];

    // Generate response using OpenAI
    const response = await this.openAIService.generateResponse(messages);

    // Check if we need to move to the next state
    if (await this.shouldMoveToNextState(conversationState, messageContent)) {
      const nextStatePrompt = await this.getNextStatePrompt(conversationState);
      return `${response}\n\n${nextStatePrompt}`;
    }

    return response;
  }

  private getSystemPromptForState(
    currentState: string,
    stateData: any,
  ): string {
    const basePrompt = `You are Rafiki, a friendly career counselor bot. You are currently in the ${currentState} stage of the conversation.`;

    const statePrompts = {
      [this.CONVERSATION_STATES.INITIAL]:
        `${basePrompt} Warmly welcome the user and introduce yourself.`,
      [this.CONVERSATION_STATES.INTERESTS]:
        `${basePrompt} Focus on understanding their interests and passions. Ask follow-up questions if their response isn't detailed enough.`,
      [this.CONVERSATION_STATES.SKILLS]:
        `${basePrompt} Explore their skills and talents. Reference their previously mentioned interests when relevant.`,
      [this.CONVERSATION_STATES.CHALLENGES]:
        `${basePrompt} Sensitively discuss their challenges and areas for growth. Be encouraging and supportive.`,
      [this.CONVERSATION_STATES.ASPIRATIONS]:
        `${basePrompt} Help them explore their future goals and dreams. Connect their aspirations to their interests and skills.`,
      [this.CONVERSATION_STATES.RECOMMENDATIONS]:
        `${basePrompt} Provide personalized career recommendations based on all previous responses.`,
    };

    return statePrompts[currentState] || basePrompt;
  }

  private async getOrCreateConversation(phoneNumber: string) {
    let conversation = await this.prisma.conversation.findFirst({
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

  private async determineConversationState(
    conversation: any,
  ): Promise<ConversationState> {
    const messages = conversation.Message;
    let currentState = await this.getStoredState(conversation.id);

    if (!currentState) {
      currentState = this.initializeState();
    }

    // Get non-system messages grouped by state
    const stateMessages = this.groupMessagesByState(messages);

    // Update state data based on messages
    currentState = await this.analyzeAndUpdateState(
      currentState,
      stateMessages,
    );

    // Determine if current state is complete and should move to next
    if (this.isStateComplete(currentState)) {
      currentState = await this.progressToNextState(
        currentState,
        conversation.id,
      );
    }

    // Store updated state
    await this.storeState(conversation.id, currentState);

    return currentState;
  }

  private initializeState(): ConversationState {
    return {
      currentState: this.CONVERSATION_STATES.INITIAL,
      stateData: Object.keys(this.CONVERSATION_STATES).reduce((acc, state) => {
        acc[state] = {
          completed: false,
          data: null,
          lastUpdated: new Date(),
        };
        return acc;
      }, {}),
    };
  }

  private async getStoredState(
    conversationId: number,
  ): Promise<ConversationState | null> {
    const storedState = await this.prisma.conversationState.findUnique({
      where: { conversationId },
    });
    return storedState ? JSON.parse(storedState.stateData) : null;
  }

  private async storeState(conversationId: number, state: ConversationState) {
    await this.prisma.conversationState.upsert({
      where: { conversationId },
      update: { stateData: JSON.stringify(state) },
      create: {
        conversationId,
        stateData: JSON.stringify(state),
      },
    });
  }

  private groupMessagesByState(messages: any[]): { [key: string]: any[] } {
    const nonSystemMessages = messages.filter((m) => m.role !== "system");
    const stateMessages: { [key: string]: any[] } = {};

    let currentState = this.CONVERSATION_STATES.INITIAL;
    nonSystemMessages.forEach((message) => {
      if (!stateMessages[currentState]) {
        stateMessages[currentState] = [];
      }

      stateMessages[currentState].push(message);

      // Determine if message completes current state
      if (this.isMessageComplete(message, currentState)) {
        const nextState = this.getNextState(currentState);
        if (nextState) {
          currentState = nextState;
        }
      }
    });

    return stateMessages;
  }

  private async analyzeAndUpdateState(
    currentState: ConversationState,
    stateMessages: { [key: string]: any[] },
  ): Promise<ConversationState> {
    const updatedState = { ...currentState };

    for (const [state, messages] of Object.entries(stateMessages)) {
      const stateRequirements = this.STATE_REQUIREMENTS[state];
      if (!stateRequirements) continue;

      const lastMessage = messages[messages.length - 1];
      const messageContent = lastMessage.content.toLowerCase();

      // Check if message meets state requirements
      const hasRequiredKeywords = stateRequirements.requiredKeywords.some(
        (keyword) => messageContent.includes(keyword),
      );
      const meetsLengthRequirement =
        messageContent.length >= stateRequirements.minMessageLength;
      const hasRequiredResponses =
        messages.length >= (stateRequirements.requiredResponseCount || 1);

      // Use OpenAI to analyze message relevance and completeness
      const isRelevant = await this.analyzeMessageRelevance(
        messageContent,
        state,
      );

      updatedState.stateData[state] = {
        completed:
          hasRequiredKeywords &&
          meetsLengthRequirement &&
          hasRequiredResponses &&
          isRelevant,
        data: {
          lastMessage: messageContent,
          messageCount: messages.length,
          hasRequiredKeywords,
          meetsLengthRequirement,
          isRelevant,
        },
        lastUpdated: new Date(),
      };
    }

    return updatedState;
  }

  private async analyzeMessageRelevance(
    message: string,
    state: string,
  ): Promise<boolean> {
    const prompt = {
      role: "system",
      content: `Analyze if the following message is a relevant and complete response for the '${state}' stage of a career counseling conversation. Consider: 1) Is it on topic? 2) Does it provide meaningful information? 3) Is it detailed enough? Respond with true or false only.`,
    };

    const userMessage = {
      role: "user",
      content: message,
    };

    const response = await this.openAIService.generateResponse([
      prompt,
      userMessage,
    ]);
    return response.toLowerCase().includes("true");
  }

  private isStateComplete(state: ConversationState): boolean {
    const currentStateData = state.stateData[state.currentState];
    return currentStateData && currentStateData.completed;
  }

  private async progressToNextState(
    currentState: ConversationState,
    conversationId: number,
  ): Promise<ConversationState> {
    const nextState = this.getNextState(currentState.currentState);
    if (nextState) {
      currentState.currentState = nextState;
      // Log state transition
      await this.prisma.stateTransition.create({
        data: {
          conversationId,
          fromState: currentState.currentState,
          toState: nextState,
          timestamp: new Date(),
        },
      });
    }
    return currentState;
  }

  private getNextState(currentState: string): string | null {
    const states = Object.values(this.CONVERSATION_STATES);
    const currentIndex = states.indexOf(currentState);
    return currentIndex < states.length - 1 ? states[currentIndex + 1] : null;
  }

  private isMessageComplete(message: any, state: string): boolean {
    const requirements = this.STATE_REQUIREMENTS[state];
    if (!requirements) return true;

    const content = message.content.toLowerCase();
    return (
      requirements.requiredKeywords.some((keyword) =>
        content.includes(keyword),
      ) && content.length >= requirements.minMessageLength
    );
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

  // async getConversationHistory(phoneNumber: string) {
  //   return this.prisma.conversation.({
  //     where: { phoneNumber },
  //     include: {
  //       Message: {
  //         orderBy: { createdAt: "asc" },
  //       },
  //     },
  //   });
  // }

  // async deleteConversation(phoneNumber: string) {
  //   return this.prisma.conversation.delete({
  //     where: { phoneNumber },
  //   });
  // }

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
