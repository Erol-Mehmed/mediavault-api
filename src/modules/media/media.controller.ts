import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { UserDecorator } from '../auth/decorators/user-decorator';
import type { UserType } from '../auth/types/user.type';
import { CreateMediaDto } from './dto/create-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  create(@UserDecorator() user: UserType, @Body() dto: CreateMediaDto) {
    return this.mediaService.create(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@UserDecorator() user: UserType) {
    return this.mediaService.getAll(user.userId);
  }
}
