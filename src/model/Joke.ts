import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IJoke {
  uuid: string;
  content: string;
}

export interface IJokeStatistics {
  count: number;
}

export class Joke {

  content: string;

  constructor(joke?: IJoke) {
    if (joke) {
      this.content = joke.content;
    } else {
      this.content = '';
    }
  }

}

export function getJokeSchema() {
  const {t} = useI18n();
  return yup.object({
    content: yup.string()
      .required(t('errors.required', {field: t('jokes.items.content')}))
  });
}
