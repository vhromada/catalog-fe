import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { type IMediaLink, type IWikiLink } from './common/Link.ts';
import { type IGenre } from './Genre.ts';

export interface IShow extends IWikiLink, IMediaLink {
  uuid: string;
  czechName: string;
  originalName: string;
  picture?: string;
  note?: string;
  genres: IGenre[];
  seasonsCount: number;
  episodesCount: number;
  length: number;
  formattedLength: string;
}

export interface IShowStatistics {
  count: number;
  seasonsCount: number;
  episodesCount: number;
  length: string;
}

export class ChangeShowRequest {

  czechName: string;
  originalName: string;
  csfd: string | undefined;
  imdbCode: number | undefined;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  picture: string | undefined;
  note: string | undefined;
  genres: string[];

  constructor(show: Show) {
    this.czechName = show.czechName;
    this.originalName = show.originalName;
    if (show.csfd == '') {
      this.csfd = undefined;
    } else {
      this.csfd = show.csfd;
    }
    if (show.imdbCode) {
      this.imdbCode = show.imdbCode;
    } else {
      this.imdbCode = undefined;
    }
    if (show.wikiEn == '') {
      this.wikiEn = undefined;
    } else {
      this.wikiEn = show.wikiEn;
    }
    if (show.wikiCz == '') {
      this.wikiCz = undefined;
    } else {
      this.wikiCz = show.wikiCz;
    }
    this.picture = show.picture;
    if (show.note == '') {
      this.note = undefined;
    } else {
      this.note = show.note;
    }
    this.genres = show.genres;
  }

}

export class Show {

  czechName: string;
  originalName: string;
  csfd: string | undefined;
  imdbCode: number | undefined;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  picture: string | undefined;
  note: string | undefined;
  genres: string[];

  constructor(show?: IShow) {
    if (show) {
      this.czechName = show.czechName;
      this.originalName = show.originalName;
      this.csfd = show.csfd;
      this.imdbCode = show.imdbCode;
      this.imdbCode = show.imdbCode;
      this.wikiEn = show.wikiEn;
      this.wikiCz = show.wikiCz;
      this.picture = show.picture;
      this.note = show.note;
      this.genres = show.genres.map((genre) => genre.uuid);
    } else {
      this.czechName = '';
      this.originalName = '';
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

export function getShowSchema() {
  const {t} = useI18n();
  return yup.object({
    czechName: yup.string()
      .required(t('errors.required', {field: t('items.czechName')}))
      .max(200, t('errors.max.string', {field: t('items.czechName').toLowerCase(), max: '${max}'})),
    originalName: yup.string()
      .required(t('errors.required', {field: t('items.originalName')}))
      .max(200, t('errors.max.string', {field: t('items.originalName').toLowerCase(), max: '${max}'})),
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
