<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { Account, Credentials, getAccountSchema } from '../../model/Account.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  account: {type: Account, required: true},
  link: {type: String, required: true},
  error: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getAccountSchema(),
  initialValues: props.account
});
const onSubmit = handleSubmit((values: any) => {
  const credentials = new Credentials(values);
  emit('submit', credentials);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <span class="error my-2" v-if="props.error">{{ props.error }}</span>
      <div class="col my-2">
        <label class="form-label" for="username">{{ t('accounts.items.username') }}</label>
        <Field type="text" id="username" name="username" class="form-control"/>
        <ErrorMessage :errors="errorBag.username"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="password">{{ t('accounts.items.password') }}</label>
        <Field type="password" id="password" name="password" class="form-control"/>
        <ErrorMessage :errors="errorBag.password"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="copyPassword">{{ t('accounts.items.copyPassword') }}</label>
        <Field type="password" id="copyPassword" name="copyPassword" class="form-control"/>
        <ErrorMessage :errors="errorBag.copyPassword"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="submit" name="submit" class="btn btn-primary">{{ props.link }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
