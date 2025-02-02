import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { type IMediaLink, type IWikiLink } from './common/Link.ts';
import { getTimeSchema, Time } from './common/Time.ts';
import { type IGenre } from './Genre.ts';

export interface IMovie extends IWikiLink, IMediaLink {
  uuid: string;
  czechName: string;
  originalName: string;
  year: number;
  languages: string[];
  subtitles: string[];
  media: IMedium[];
  length: number;
  formattedLength: string;
  picture?: string;
  note?: string;
  genres: IGenre[];
}

export interface IMedium {
  number: number;
  length: number;
  formattedLength: string;
}

export interface IMovieStatistics {
  count: number;
  mediaCount: number;
  length: string;
}

export class ChangeMovieRequest {

  czechName: string;
  originalName: string;
  year: number;
  languages: string[];
  subtitles: string[];
  media: number[];
  csfd: string | undefined;
  imdbCode: number | undefined;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  picture: string | undefined;
  note: string | undefined;
  genres: string[];

  constructor(movie: Movie) {
    this.czechName = movie.czechName;
    this.originalName = movie.originalName;
    this.year = movie.year;
    this.languages = movie.languages;
    this.subtitles = movie.subtitles;
    this.media = movie.media.map((medium) => medium.getLength());
    if (movie.csfd == '') {
      this.csfd = undefined;
    } else {
      this.csfd = movie.csfd;
    }
    if (movie.imdbCode) {
      this.imdbCode = movie.imdbCode;
    } else {
      this.imdbCode = undefined;
    }
    if (movie.wikiEn == '') {
      this.wikiEn = undefined;
    } else {
      this.wikiEn = movie.wikiEn;
    }
    if (movie.wikiCz == '') {
      this.wikiCz = undefined;
    } else {
      this.wikiCz = movie.wikiCz;
    }
    this.picture = movie.picture;
    if (movie.note == '') {
      this.note = undefined;
    } else {
      this.note = movie.note;
    }
    this.genres = movie.genres;
  }

}

export class Movie {

  czechName: string;
  originalName: string;
  year: number;
  languages: string[];
  subtitles: string[];
  media: Time[];
  csfd: string | undefined;
  imdbCode: number | undefined;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  picture: string | undefined;
  note: string | undefined;
  genres: string[];

  constructor(movie?: IMovie) {
    if (movie) {
      this.czechName = movie.czechName;
      this.originalName = movie.originalName;
      this.year = movie.year;
      this.languages = movie.languages;
      this.subtitles = movie.subtitles;
      this.media = movie.media.map((medium) => new Time(medium.length));
      this.csfd = movie.csfd;
      this.imdbCode = movie.imdbCode;
      this.wikiEn = movie.wikiEn;
      this.wikiCz = movie.wikiCz;
      this.picture = movie.picture;
      this.note = movie.note;
      this.genres = movie.genres.map((genre) => genre.uuid);
    } else {
      this.czechName = '';
      this.originalName = '';
      this.year = new Date().getFullYear();
      this.languages = [];
      this.subtitles = [];
      this.media = [new Time()];
      this.csfd = undefined;
      this.imdbCode = undefined;
      this.wikiEn = undefined;
      this.wikiCz = undefined;
      this.picture = undefined;
      this.note = undefined;
      this.genres = [];
    }
  }

}

export function getMovieSchema() {
  const {t} = useI18n();
  const currentYear = new Date().getFullYear();
  return yup.object({
    czechName: yup.string()
      .required(t('errors.required', {field: t('items.czechName')}))
      .max(200, t('errors.max.string', {field: t('items.czechName').toLowerCase(), max: '${max}'})),
    originalName: yup.string()
      .required(t('errors.required', {field: t('items.originalName')}))
      .max(200, t('errors.max.string', {field: t('items.originalName').toLowerCase(), max: '${max}'})),
    year: yup.number()
      .required(t('errors.required', {field: t('movies.items.year')}))
      .min(1930, t('errors.min.number', {field: t('movies.items.year').toLowerCase(), min: '${min}'}))
      .max(currentYear, t('errors.max.number', {field: t('movies.items.year').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('movies.items.year')})),
    languages: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('items.language')})))
      .min(1, t('errors.min.list', {field: t('items.language').toLowerCase(), min: '${min}'})),
    subtitles: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('items.subtitles')}))),
    media: yup.array()
      .of(getTimeSchema())
      .min(1, t('errors.min.list', {field: t('movies.items.medium').toLowerCase(), min: '${min}'})),
    csfd: yup.string()
      .max(100, t('errors.max.string', {field: t('items.csfd'), max: '${max}'})),
    imdbCode: yup.number()
      .min(1, t('errors.min.number', {field: t('items.imdb'), min: '${min}'}))
      .max(999999999, t('errors.max.number', {field: t('items.imdb'), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.imdb')})),
    wikiEn: yup.string()
      .max(100, t('errors.max.string', {field: t('items.wikiEn'), max: '${max}'})),
    wikiCz: yup.string()
      .max(100, t('errors.max.string', {field: t('items.wikiCz'), max: '${max}'})),
    picture: yup.string(),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'})),
    genres: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('genres.header')})))
      .min(1, t('errors.min.list', {field: t('genres.header').toLowerCase(), min: '${min}'}))
  });
}
