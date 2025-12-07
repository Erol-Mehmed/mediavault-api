import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

export interface MediaFactoryOutput {
  id: string;
  title: string;
  description: string;
  type: 'movie';
  release_date: string;
  tmdb_id: number;
  poster_url: string;
  genres: string[];
}

const genresPool = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Romance',
  'Mystery',
];

const randomGenres = (): string[] => {
  const count = faker.number.int({ min: 1, max: 3 });

  return faker.helpers.arrayElements(genresPool, count);
};

export const movieFactory = (): MediaFactoryOutput => ({
  id: uuid(),
  title: faker.lorem.words({ min: 2, max: 5 }),
  description: faker.lorem.paragraph(),
  type: 'movie',
  release_date: faker.date.past({ years: 10 }).toISOString().split('T')[0],
  tmdb_id: faker.number.int({ min: 10000, max: 999999 }),
  poster_url: faker.image.urlPicsumPhotos(),
  genres: randomGenres(),
});
