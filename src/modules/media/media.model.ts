export type MediaType =
  | 'movie'
  | 'tv'
  | 'anime'
  | 'book'
  | 'game'
  | 'documentary';

export default interface Media {
  id: string;

  media_type: MediaType;

  external_id?: string | null;
  external_source?: 'tmdb' | 'google_books' | 'igdb' | null;

  title: string;
  description?: string | null;
  release_date?: string | null;

  poster_url?: string | null;
  backdrop_url?: string | null;

  genres?: string[];
  rating?: number | null;

  runtime?: number | null;
  total_episodes?: number | null;

  authors?: string[];
  platforms?: string[];

  created_at: string;
  updated_at: string;
}
