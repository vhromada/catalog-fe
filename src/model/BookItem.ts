import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IBookItem {
  uuid: string;
  languages: string[];
  format: string;
  note?: string;
}

export class BookItem {

  languages: string[];
  format: string;
  note: string | undefined;

  constructor(bookItem?: IBookItem) {
    if (bookItem) {
      this.languages = bookItem.languages;
      this.format = bookItem.format;
      this.note = bookItem.note;
    } else {
      this.languages = [];
      this.format = '';
      this.note = '';
    }
  }

  normalize() {
    if (this.note == '') {
      this.note = undefined;
    }
  }

}

export function getBookItemSchema() {
  const {t} = useI18n();
  return yup.object({
    languages: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('items.language')})))
      .min(1, t('errors.min.list', {field: t('items.language').toLowerCase(), min: '${min}'})),
    format: yup.string()
      .required(t('errors.required', {field: t('items.format')})),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'}))
  });
}
