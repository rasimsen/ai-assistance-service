import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { Channel, ConversationType, Direction } from './conversation.enums';

export class CreateConversationDto {
  @ApiProperty({ example: '2025-12-23T01:00:00.000Z' })
  @IsDateString()
  startedAt!: string;

  @ApiPropertyOptional({ example: '2025-12-23T01:10:00.000Z' })
  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @ApiPropertyOptional({ example: 600, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @ApiProperty({ example: 'User: Hello\nAI: Hi! How can I help?' })
  @IsString()
  conversation!: string;

  @ApiProperty({ enum: ConversationType, example: ConversationType.TEXT })
  @IsEnum(ConversationType)
  conversationType!: ConversationType;

  @ApiPropertyOptional({ example: 'https://storage.example.com/audio/abc.mp3' })
  @IsOptional()
  @IsUrl()
  conversationVoiceUrl?: string;

  @ApiProperty({ enum: Direction, example: Direction.CUSTOMER })
  @IsEnum(Direction)
  direction!: Direction;

  @ApiPropertyOptional({ example: '+447700900123' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  channelUserId?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  displayName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsUrl()
  displayPhotoUrl?: string;

  @ApiProperty({ enum: Channel, example: Channel.TWILIO })
  @IsEnum(Channel)
  channel!: Channel;

  @ApiPropertyOptional({
    description: 'External correlation id from channel/provider (unique if provided).',
    example: 'CA1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalId?: string;

  @ApiPropertyOptional({
    description: 'Free-form metadata (Twilio callSid, Telegram message ids, etc.).',
    example: { callSid: 'CAxxx', telegramChatId: '123' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
