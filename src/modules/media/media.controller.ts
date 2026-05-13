import { Controller, Get, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { UserDecorator } from '../auth/decorators/user-decorator';
import type { UserType } from '../auth/types/user.type';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@UserDecorator() user: UserType) {
    return this.mediaService.getAll(user.userId);
  }
}
