import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { IWikiLink } from './common/Link.ts';

export interface IGame extends IWikiLink {
  uuid: string;
  name: string;
  mediaCount: number;
  format: string;
  crack: boolean;
  serialKey: boolean;
  patch: boolean;
  trainer: boolean;
  trainerData: boolean;
  editor: boolean;
  saves: boolean;
  otherData?: string;
  note?: string;
  cheat: boolean;
}

export interface IGameStatistics {
  count: number;
  mediaCount: number;
}

export class Game {

  name: string;
  wikiEn: string | undefined;
  wikiCz: string | undefined;
  mediaCount: number;
  format: string;
  crack: boolean;
  serialKey: boolean;
  patch: boolean;
  trainer: boolean;
  trainerData: boolean;
  editor: boolean;
  saves: boolean;
  otherData: string | undefined;
  note: string | undefined;

  constructor(game?: IGame) {
    if (game) {
      this.name = game.name;
      this.wikiEn = game.wikiEn;
      this.wikiCz = game.wikiCz;
      this.mediaCount = game.mediaCount;
      this.format = game.format;
      this.crack = game.crack;
      this.serialKey = game.serialKey;
      this.patch = game.patch;
      this.trainer = game.trainer;
      this.trainerData = game.trainerData;
      this.editor = game.editor;
      this.saves = game.saves;
      this.otherData = game.otherData;
      this.note = game.note;
    } else {
      this.name = '';
      this.wikiEn = undefined;
      this.wikiCz = undefined;
      this.mediaCount = 1;
      this.format = '';
      this.crack = false;
      this.serialKey = false;
      this.patch = false;
      this.trainer = false;
      this.trainerData = false;
      this.editor = false;
      this.saves = false;
      this.otherData = undefined;
      this.note = undefined;
    }
  }

  public normalize() {
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

export function getGameSchema() {
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
    patch: yup.bool(),
    trainer: yup.bool(),
    trainerData: yup.bool(),
    editor: yup.bool(),
    saves: yup.bool(),
    otherData: yup.string()
      .max(100, t('errors.max.string', {field: t('items.otherData').toLowerCase(), max: '${max}'})),
    note: yup.string()
      .max(100, t('errors.max.string', {field: t('items.note').toLowerCase(), max: '${max}'}))
  });
}
