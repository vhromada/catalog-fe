import { IAuthor } from '../model/Author.ts';
import { IGenre } from '../model/Genre.ts';

export function formatImdbCode(imdbCode: number): string {
  return imdbCode.toString().padStart(7, '0');
}

export function formatGenres(genres: any[]): string {
  return genres.map((genre: IGenre) => genre.name).join(', ');
}

export function formatAuthor(author: IAuthor): string {
  const result = [];
  result.push(author.firstName);
  if (author.middleName) {
    result.push(author.middleName);
  }
  result.push(author.lastName);
  return result.join(' ');
}
