import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { IWikiLink } from './common/Link.ts';

export interface IProgram extends IWikiLink {
  uuid: string;
  name: string;
  mediaCount: number;
  format: string;
  crack: boolean;
  serialKey: boolean;
  otherData?: string;
  note?: string;
}

export interface IProgramStatistics {
  count: number;
  mediaCount: number;
}

export class Program {

  name: string;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  mediaCount: number;
  format: string;
  crack: boolean;
  serialKey: boolean;
  otherData: string | undefined;
  note: string | undefined;

  constructor(program?: IProgram) {
    if (program) {
      this.name = program.name;
      this.wikiEn = program.wikiEn;
      this.wikiCz = program.wikiCz;
      this.mediaCount = program.mediaCount;
      this.format = program.format;
      this.crack = program.crack;
      this.serialKey = program.serialKey;
      this.otherData = program.otherData;
      this.note = program.note;
    } else {
      this.name = '';
      this.wikiEn = undefined;
      this.wikiCz = undefined;
      this.mediaCount = 1;
      this.format = '';
      this.crack = false;
      this.serialKey = false;
      this.otherData = undefined;
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
    if (this.otherData == '') {
      this.otherData = undefined;
    }
    if (this.note == '') {
      this.note = undefined;
    }
  }

}

export function getProgramSchema() {
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
    format: yup.string()
      .required(t('errors.required', {field: t('items.format')})),
    crack: yup.bool(),
    serialKey: yup.bool(),
    otherData: yup.string()
      .max(100, t('errors.max.string', {field: t('items.otherData').toLowerCase(), max: '${max}'})),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'}))
  });
}
