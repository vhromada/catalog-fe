import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IGenre {
  uuid: string;
  name: string;
}

export interface IGenreStatistics {
  count: number;
}

export class Genre {

  name: string;

  constructor(genre?: IGenre) {
    if (genre) {
      this.name = genre.name;
    } else {
      this.name = '';
    }
  }

}

export function getGenreSchema() {
  const {t} = useI18n();
  return yup.object({
    name: yup.string()
      .required(t('errors.required', {field: t('items.name')}))
      .max(200, t('errors.max.string', {field: t('items.name').toLowerCase(), max: '${max}'}))
  });
}
