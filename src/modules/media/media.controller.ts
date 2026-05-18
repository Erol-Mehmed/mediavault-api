import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { UserDecorator } from '../auth/decorators/user-decorator';
import type { UserType } from '../auth/types/user.type';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UserDecorator() user: UserType, @Body() dto: CreateMediaDto) {
    return this.mediaService.create(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @UserDecorator() user: UserType,
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
  ) {
    return this.mediaService.update(user.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@UserDecorator() user: UserType, @Param('id') id: string) {
    await this.mediaService.remove(user.userId, id);

    return { message: 'Media successfully deleted' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@UserDecorator() user: UserType) {
    return this.mediaService.getAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@UserDecorator() user: UserType, @Param('id') id: string) {
    return this.mediaService.getOne(user.userId, id);
  }
}
