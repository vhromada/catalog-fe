import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { IWikiLink } from './common/Link.ts';

export interface IMusic extends IWikiLink {
  uuid: string;
  name: string;
  mediaCount: number;
  note?: string;
  songsCount: number;
  length: number;
  formattedLength: string;
}

export interface IMusicStatistics {
  count: number;
  songsCount: number;
  mediaCount: number;
  length: string;
}

export class Music {

  name: string;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  mediaCount: number;
  note: string | undefined;

  constructor(music?: IMusic) {
    if (music) {
      this.name = music.name;
      this.wikiEn = music.wikiEn;
      this.wikiCz = music.wikiCz;
      this.mediaCount = music.mediaCount;
      this.note = music.note;
    } else {
      this.name = '';
      this.wikiEn = undefined;
      this.wikiCz = undefined;
      this.mediaCount = 1;
      this.note = undefined;
    }
  }

  normalize() {
    if (this.wikiEn == '') {
      this.wikiEn = undefined;
    }
    if (this.wikiCz == '') {
      this.wikiCz = undefined;
    }
    if (this.note == '') {
      this.note = undefined;
    }
  }

}

export function getMusicSchema() {
  const {t} = useI18n();
  return yup.object({
    name: yup.string()
      .required(t('errors.required', {field: t('items.name')}))
      .max(200, t('errors.max.string', {field: t('items.name').toLowerCase(), max: '${max}'})),
    wikiEn: yup.string()
      .max(100, t('errors.max.string', {field: t('items.wikiEn'), max: '${max}'})),
    wikiCz: yup.string()
      .max(100, t('errors.max.string', {field: t('items.wikiCz'), max: '${max}'})),
    mediaCount: yup.number()
      .required(t('errors.required', {field: t('items.mediaCount')}))
      .min(1, t('errors.min.number', {field: t('items.mediaCount').toLowerCase(), min: '${min}'}))
      .max(100, t('errors.max.number', {field: t('items.mediaCount').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.mediaCount')})),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'}))
  });
}
