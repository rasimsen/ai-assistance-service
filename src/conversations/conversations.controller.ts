import { Controller, Get, Param, Post, Body, Patch, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly service: ConversationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a conversation transcript record' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateConversationDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by id' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'List conversations (paged)' })
  @ApiQuery({ name: 'take', required: false, example: 20 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  list(
    @Query('take', new ParseIntPipe({ optional: true })) take = 20,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
  ) {
    const safeTake = Math.min(Math.max(take, 1), 100);
    const safeSkip = Math.max(skip, 0);
    return this.service.list({ take: safeTake, skip: safeSkip });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a conversation' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateConversationDto) {
    return this.service.update(id, dto);
  }
}
