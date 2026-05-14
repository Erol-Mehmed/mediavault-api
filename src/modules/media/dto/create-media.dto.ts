import {
  IsIn,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsInt,
  IsUrl,
  IsDateString,
  Length,
} from 'class-validator';
import type { MediaType } from '../media.model';

export class CreateMediaDto {
  @IsIn(['movie', 'tv', 'anime', 'book', 'game', 'documentary'])
  media_type: MediaType;

  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  external_id?: string | null;

  @IsOptional()
  @IsIn(['tmdb', 'google_books', 'igdb'])
  external_source?: 'tmdb' | 'google_books' | 'igdb' | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsDateString()
  release_date?: string | null;

  @IsOptional()
  @IsUrl()
  poster_url?: string | null;

  @IsOptional()
  @IsUrl()
  backdrop_url?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  rating?: number | null;

  @IsOptional()
  @IsInt()
  runtime?: number | null;

  @IsOptional()
  @IsInt()
  total_episodes?: number | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];
}
