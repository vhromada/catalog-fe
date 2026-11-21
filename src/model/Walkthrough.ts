import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IWalkthrough {
  uuid: string;
  content: string;
}

export class Walkthrough {

  content: string;

  constructor(walkthrough?: IWalkthrough) {
    if (walkthrough) {
      this.content = walkthrough.content;
    } else {
      this.content = '';
    }
  }

}

export function getWalkthroughSchema() {
  const {t} = useI18n();
  return yup.object({
    content: yup.string()
      .required(t('errors.required', {field: t('walkthroughs.items.content')}))
  });
}
