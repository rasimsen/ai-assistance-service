import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateConversationDto) {
    try {
      return await this.prisma.conversation.create({
        data: {
          startedAt: new Date(dto.startedAt),
          endedAt: dto.endedAt ? new Date(dto.endedAt) : null,
          durationSeconds: dto.durationSeconds ?? null,
          conversation: dto.conversation,
          conversationType: dto.conversationType,
          conversationVoiceUrl: dto.conversationVoiceUrl ?? null,
          direction: dto.direction,
          channelUserId: dto.channelUserId ?? null,
          displayName: dto.displayName ?? null,
          displayPhotoUrl: dto.displayPhotoUrl ?? null,
          channel: dto.channel,
          externalId: dto.externalId ?? null,
          metadata: (dto.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        },
      });
    } catch (e: unknown) {
      // Prisma unique constraint
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('externalId must be unique');
      }
      throw e;
    }
  }

  async findById(id: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async list(params: { take: number; skip: number }) {
    const [items, total] = await Promise.all([
      this.prisma.conversation.findMany({
        orderBy: { startedAt: 'desc' },
        take: params.take,
        skip: params.skip,
      }),
      this.prisma.conversation.count(),
    ]);

    return { items, total };
  }

  async update(id: string, dto: UpdateConversationDto) {
    try {
      return await this.prisma.conversation.update({
        where: { id },
        data: {
          startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
          endedAt: dto.endedAt ? new Date(dto.endedAt) : undefined,
          durationSeconds: dto.durationSeconds,
          conversation: dto.conversation,
          conversationType: dto.conversationType,
          conversationVoiceUrl: dto.conversationVoiceUrl,
          direction: dto.direction,
          channelUserId: dto.channelUserId,
          displayName: dto.displayName,
          displayPhotoUrl: dto.displayPhotoUrl,
          channel: dto.channel,
          externalId: dto.externalId,
          metadata: dto.metadata ? (dto.metadata as Prisma.InputJsonValue) : undefined,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new NotFoundException('Conversation not found');
        if (e.code === 'P2002') throw new ConflictException('externalId must be unique');
      }
      throw e;
    }
  }
}
