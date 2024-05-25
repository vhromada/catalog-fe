import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface ISeason {
  uuid: string;
  number: number;
  startYear: number;
  endYear: number;
  language: string;
  subtitles: string[];
  note?: string;
  episodesCount: number;
  length: number;
  formattedLength: string;
}

export class Season {

  number: number;
  startYear: number;
  endYear: number;
  language: string;
  subtitles: string[];
  note: string | undefined;

  constructor(season?: ISeason) {
    if (season) {
      this.number = season.number;
      this.startYear = season.startYear;
      this.endYear = season.endYear;
      this.language = season.language;
      this.subtitles = season.subtitles;
      this.note = season.note;
    } else {
      const currentYear = new Date().getFullYear();
      this.number = 1;
      this.startYear = currentYear;
      this.endYear = currentYear;
      this.language = '';
      this.subtitles = [];
      this.note = undefined;
    }
  }

  normalize() {
    if (this.note == '') {
      this.note = undefined;
    }
  }

}

export function getSeasonSchema() {
  const {t} = useI18n();
  const currentYear = new Date().getFullYear();
  return yup.object({
    number: yup.number()
      .required(t('errors.required', {field: t('items.number')}))
      .min(1, t('errors.min.number', {field: t('items.number').toLowerCase(), min: '${min}'}))
      .max(500, t('errors.max.number', {field: t('items.number').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.number')})),
    startYear: yup.number()
      .required(t('errors.required', {field: t('seasons.items.startYear')}))
      .min(1930, t('errors.min.number', {field: t('seasons.items.startYear').toLowerCase(), min: '${min}'}))
      .max(currentYear, t('errors.max.number', {field: t('seasons.items.startYear').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('seasons.items.startYear')})),
    endYear: yup.number()
      .required(t('errors.required', {field: t('seasons.items.endYear')}))
      .min(1930, t('errors.min.number', {field: t('seasons.items.endYear').toLowerCase(), min: '${min}'}))
      .max(currentYear, t('errors.max.number', {field: t('seasons.items.endYear').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('seasons.items.endYear')}))
      .test('years', t('seasons.errors.years'), function (value) {
        if (this.parent.startYear) {
          return this.parent.startYear <= value;
        } else {
          return true;
        }
      }),
    language: yup.string()
      .required(t('errors.required', {field: t('items.language')})),
    subtitles: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('items.subtitles')}))),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'}))
  });
}
