import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IHandbook {
  uuid: string;
  content: string;
}

export class Handbook {

  content: string;

  constructor(handbook?: IHandbook) {
    if (handbook) {
      this.content = handbook.content;
    } else {
      this.content = '';
    }
  }

}

export function getHandbookSchema() {
  const {t} = useI18n();
  return yup.object({
    content: yup.string()
      .required(t('errors.required', {field: t('handbooks.items.content')}))
  });
}
