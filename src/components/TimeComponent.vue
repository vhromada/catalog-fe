<script setup lang="ts">
import { Field } from 'vee-validate';
import ErrorMessage from './ErrorMessage.vue';

const props = defineProps({
  path: {type: String, required: true},
  prefix: {type: String},
  errorBag: {type: Object}
});
const hoursName = props.path + '.hours';
const minutesName = props.path + '.minutes';
const secondsName = props.path + '.seconds';
let hoursId: string;
let minutesId: string;
let secondsId: string;
if (props.prefix) {
  hoursId = props.prefix + 'Hours';
  minutesId = props.prefix + 'Minutes';
  secondsId = props.prefix + 'Seconds';
} else {
  hoursId = 'hours';
  minutesId = 'minutes';
  secondsId = 'seconds';
}
</script>

<template>
  <div class="form-group">
    <label class="form-label" :for="hoursId">{{ $t('items.hours') }}</label>
    <Field type="number" class="form-control" :id="hoursId" :name="hoursName" min="0" max="23" step="1"/>
    <ErrorMessage :errors="errorBag?.[`${hoursName}`]"/>
  </div>
  <div class="form-group">
    <label class="form-label" :for="minutesId">{{ $t('items.minutes') }}</label>
    <Field type="number" class="form-control" :id="minutesId" :name="minutesName" min="0" max="59" step="1"/>
    <ErrorMessage :errors="errorBag?.[`${minutesName}`]"/>
  </div>
  <div class="form-group">
    <label class="form-label" :for="secondsId">{{ $t('items.seconds') }}</label>
    <Field type="number" class="form-control" :id="secondsId" :name="secondsName" min="0" max="59" step="1"/>
    <ErrorMessage :errors="errorBag?.[`${secondsName}`]"/>
  </div>
</template>
