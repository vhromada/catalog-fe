import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export class Time {

  hours: number;
  minutes: number;
  seconds: number;

  constructor(length?: number) {
    if (length) {
      const temp = length % 3600;
      this.hours = (length - temp) / 3600;
      this.seconds = temp % 60;
      this.minutes = (temp - this.seconds) / 60;
    } else {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }

  getLength(): number {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }

}

export function getTimeSchema() {
  const {t} = useI18n();
  return yup.object({
    hours: yup.number()
      .required(t('errors.required', {field: t('items.hours')}))
      .min(0, t('errors.min.number', {field: t('items.hours').toLowerCase(), min: '${min}'}))
      .max(23, t('errors.max.number', {field: t('items.hours').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.hours')})),
    minutes: yup.number()
      .required(t('errors.required', {field: t('items.minutes')}))
      .min(0, t('errors.min.number', {field: t('items.minutes').toLowerCase(), min: '${min}'}))
      .max(59, t('errors.max.number', {field: t('items.minutes').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.minutes')})),
    seconds: yup.number()
      .required(t('errors.required', {field: t('items.seconds')}))
      .min(0, t('errors.min.number', {field: t('items.seconds').toLowerCase(), min: '${min}'}))
      .max(59, t('errors.max.number', {field: t('items.seconds').toLowerCase(), max: '${max}'}))
      .typeError(t('errors.required', {field: t('items.seconds')}))
      .test('time', t('errors.time'), function (value) {
        return this.parent.hours != 0 || this.parent.minutes != 0 || value != 0;
      })
  });
}
