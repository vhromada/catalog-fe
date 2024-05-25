import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IAuthor {
  uuid: string;
  firstName: string,
  middleName?: string,
  lastName: string
}

export interface IAuthorStatistics {
  count: number;
}

export class Author {

  firstName: string;
  middleName: string | undefined;
  lastName: string;

  constructor(author?: IAuthor) {
    if (author) {
      this.firstName = author.firstName;
      this.middleName = author.middleName;
      this.lastName = author.lastName;
    } else {
      this.firstName = '';
      this.middleName = undefined;
      this.lastName = '';
    }
  }

  normalize() {
    if (this.middleName == '') {
      this.middleName = undefined;
    }
  }

}

export function getAuthorSchema() {
  const {t} = useI18n();
  return yup.object({
    firstName: yup.string()
      .required(t('errors.required', {field: t('authors.items.firstName')}))
      .max(100, t('errors.max.string', {field: t('authors.items.firstName').toLowerCase(), max: '${max}'})),
    middleName: yup.string()
      .max(100, t('errors.max.string', {field: t('authors.items.middleName').toLowerCase(), max: '${max}'})),
    lastName: yup.string()
      .required(t('errors.required', {field: t('authors.items.lastName')}))
      .max(100, t('errors.max.string', {field: t('authors.items.lastName').toLowerCase(), max: '${max}'}))
  });
}
