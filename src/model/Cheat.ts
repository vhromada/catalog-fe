import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface ICheat {
  uuid: string;
  gameSetting?: string;
  cheatSetting?: string;
  data: ICheatData[];
}

export interface ICheatData {
  action: string;
  description: string;
}

export class ChangeCheatRequest {

  gameSetting: string | undefined;
  cheatSetting: string | undefined;
  data: CheatData[];

  constructor(cheat: Cheat) {
    if (cheat.gameSetting == '') {
      this.gameSetting = undefined;
    } else {
      this.gameSetting = cheat.gameSetting;
    }
    if (cheat.cheatSetting == '') {
      this.cheatSetting = undefined;
    } else {
      this.cheatSetting = cheat.cheatSetting;
    }
    this.data = cheat.data;
  }

}

export class Cheat {

  gameSetting: string | undefined;
  cheatSetting: string | undefined;
  data: CheatData[];

  constructor(cheat?: ICheat) {
    if (cheat) {
      this.gameSetting = cheat.gameSetting;
      this.cheatSetting = cheat.cheatSetting;
      this.data = cheat.data.map((data) => new CheatData(data));
    } else {
      this.gameSetting = undefined;
      this.cheatSetting = undefined;
      this.data = [new CheatData()];
    }
  }

}

export class CheatData {

  action: string;
  description: string;

  constructor(data?: CheatData) {
    if (data) {
      this.action = data.action;
      this.description = data.description;
    } else {
      this.action = '';
      this.description = '';
    }
  }

}

export function getCheatSchema() {
  const {t} = useI18n();
  return yup.object({
    gameSetting: yup.string()
      .max(200, t('errors.max.string', {field: t('cheats.items.gameSetting').toLowerCase(), max: '${max}'})),
    cheatSetting: yup.string()
      .max(200, t('errors.max.string', {field: t('cheats.items.cheatSetting').toLowerCase(), max: '${max}'})),
    data: yup.array()
      .of(getCheatDataSchema(t))
      .min(1, t('errors.min.list', {field: t('cheats.items.data'), min: '${min}'}))
  });
}

function getCheatDataSchema(t: any) {
  return yup.object({
    action: yup.string()
      .required(t('errors.required', {field: t('cheats.items.action')}))
      .max(200, t('errors.max.string', {field: t('cheats.items.action').toLowerCase(), max: '${max}'})),
    description: yup.string()
      .required(t('errors.required', {field: t('items.description')}))
      .max(200, t('errors.max.string', {field: t('items.description').toLowerCase(), max: '${max}'}))
  });
}
