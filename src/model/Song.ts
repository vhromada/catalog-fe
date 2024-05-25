import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { getTimeSchema, Time } from './common/Time.ts';

export interface ISong {
  uuid: string;
  name: string;
  length: number;
  formattedLength: string;
  note?: string;
}

export class ChangeSongRequest {

  name: string;
  length: number;
  note: string | undefined;

  constructor(song: Song) {
    this.name = song.name;
    this.length = song.length.getLength();
    if (song.note == '') {
      this.note = undefined;
    } else {
      this.note = song.note;
    }
  }

}

export class Song {

  name: string;
  length: Time;
  note: string | undefined;

  constructor(song?: ISong) {
    if (song) {
      this.name = song.name;
      this.length = new Time(song.length);
      this.note = song.note;
    } else {
      this.name = '';
      this.length = new Time();
      this.note = undefined;
    }
  }

}

export function getSongSchema() {
  const {t} = useI18n();
  return yup.object({
    name: yup.string()
      .required(t('errors.required', {field: t('items.name')}))
      .max(100, t('errors.max.string', {field: t('items.name').toLowerCase(), max: '${max}'})),
    length: getTimeSchema(),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'}))
  });
}
