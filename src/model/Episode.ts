import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { getTimeSchema, Time } from './common/Time.ts';

export interface IEpisode {
  uuid: string;
  number: number;
  name: string;
  length: number;
  formattedLength: string;
  note?: string;
}

export class ChangeEpisodeRequest {

  number: number;
  name: string;
  length: number;
  note: string | undefined;

  constructor(episode: Episode) {
    this.number = episode.number;
    this.name = episode.name;
    this.length = episode.length.getLength();
    if (episode.note == '') {
      this.note = undefined;
    } else {
      this.note = episode.note;
    }
  }

}

export class Episode {

  number: number;
  name: string;
  length: Time;
  note: string | undefined;

  constructor(episode?: IEpisode) {
    if (episode) {
      this.number = episode.number;
      this.name = episode.name;
      this.length = new Time(episode.length);
      this.note = episode.note;
    } else {
      this.number = 1;
      this.name = '';
      this.length = new Time();
      this.note = undefined;
    }
  }

}

export function getEpisodeSchema() {
  const {t} = useI18n();
  return yup.object({
    number: yup.number()
      .required(t('errors.required', {field: t('items.number')}))
      .min(1, t('errors.min.number', {field: t('items.number').toLowerCase(), min: '${min}'}))
      .max(500, t('errors.max.number', {field: t('items.number').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.number')})),
    name: yup.string()
      .required(t('errors.required', {field: t('items.name')}))
      .max(100, t('errors.max.string', {field: t('items.name').toLowerCase(), max: '${max}'})),
    length: getTimeSchema(),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note'), max: '${max}'}))
  });
}
