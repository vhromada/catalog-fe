import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { IAuthor } from './Author.ts';

export interface IBook {
  uuid: string;
  czechName: string;
  originalName: string;
  description: string;
  note?: string;
  authors: IAuthor[];
  itemsCount: number;
}

export interface IBookStatistics {
  count: number;
  itemsCount: number;
}

export class ChangeBookRequest {

  czechName: string;
  originalName: string;
  description: string;
  note: string | undefined;
  authors: string[];

  constructor(book: Book) {
    this.czechName = book.czechName;
    this.originalName = book.originalName;
    this.description = book.description;
    if (book.note == '') {
      this.note = undefined;
    } else {
      this.note = book.note;
    }
    this.authors = book.authors;
  }

}

export class Book {

  czechName: string;
  originalName: string;
  description: string;
  note: string | undefined;
  authors: string[];

  constructor(book?: IBook) {
    if (book) {
      this.czechName = book.czechName;
      this.originalName = book.originalName;
      this.description = book.description;
      this.note = book.note;
      this.authors = book.authors.map((author) => author.uuid);
    } else {
      this.czechName = '';
      this.originalName = '';
      this.description = '';
      this.note = undefined;
      this.authors = [];
    }
  }

}

export function getBookSchema() {
  const {t} = useI18n();
  return yup.object({
    czechName: yup.string()
      .required(t('errors.required', {field: t('items.czechName')}))
      .max(200, t('errors.max.string', {field: t('items.czechName').toLowerCase(), max: '${max}'})),
    originalName: yup.string()
      .required(t('errors.required', {field: t('items.originalName')}))
      .max(200, t('errors.max.string', {field: t('items.originalName').toLowerCase(), max: '${max}'})),
    description: yup.string()
      .required(t('errors.required', {field: t('items.description')}))
      .max(1000, t('errors.max.string', {field: t('items.description').toLowerCase(), max: '${max}'})),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'})),
    authors: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('authors.header')})))
      .min(1, t('errors.min.list', {field: t('authors.header').toLowerCase(), min: '${min}'}))
  });
}
