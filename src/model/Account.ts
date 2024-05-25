import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IAccount {
  uuid: string;
  username: string;
  locked: boolean;
  roles: string[];
}

export interface IAccountStatistics {
  count: number;
}

export class Account {

  username: string;
  password: string;
  copyPassword: string;

  constructor(account?: IAccount) {
    if (account) {
      this.username = account.username;
      this.password = '';
      this.copyPassword = '';
    } else {
      this.username = '';
      this.password = '';
      this.copyPassword = '';
    }
  }

}

export class Credentials {

  username: string;
  password: string;

  constructor(account?: Account) {
    if (account) {
      this.username = account.username;
      this.password = account.password;
    } else {
      this.username = '';
      this.password = '';
    }
  }

}

export class ChangeRoles {

  roles: string[];

  constructor(account: IAccount) {
    this.roles = account.roles;
  }

}

export function getCredentialsSchema() {
  const {t} = useI18n();
  return yup.object({
    username: yup.string()
      .required(t('errors.required', {field: t('accounts.items.username')})),
    password: yup.string()
      .required(t('errors.required', {field: t('accounts.items.password')}))
  });
}

export function getAccountSchema() {
  const {t} = useI18n();
  return yup.object({
    username: yup.string()
      .required(t('errors.required', {field: t('accounts.items.username')}))
      .max(200, t('errors.max.string', {field: t('accounts.items.username').toLowerCase(), max: '${max}'})),
    password: yup.string()
      .required(t('errors.required', {field: t('accounts.items.password')}))
      .max(200, t('errors.max.string', {field: t('accounts.items.password').toLowerCase(), max: '${max}'})),
    copyPassword: yup.string()
      .required(t('errors.required', {field: t('accounts.items.copyPassword')}))
      .max(200, t('errors.max.string', {field: t('accounts.items.copyPassword').toLowerCase(), max: '${max}'}))
      .test('passwords', t('accounts.errors.passwords'), function (value) {
        return !this.parent.password || this.parent.password == value;
      })
  });
}

export function getRoleSchema() {
  const {t} = useI18n();
  return yup.object({
    roles: yup.array()
      .of(yup.string()
        .required(t('errors.required', {field: t('accounts.errors.role')})))
      .min(1, t('errors.min.list', {field: t('accounts.errors.role').toLowerCase(), min: '${min}'}))
  });
}
