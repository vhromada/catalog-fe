<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ErrorMessage from '../../components/ErrorMessage.vue';
import ResultError from '../../components/ResultError.vue';
import { Credentials, getCredentialsSchema } from '../../model/Account.ts';
import { IResult } from '../../model/common/Result.ts';
import { modalOpen } from '../../model/common/View.ts';
import { userStore } from '../../store/UserStore.ts';
import { emitter } from '../../utils/Event.ts';

const router = useRouter();
const {t} = useI18n();
const error = ref('');
const {handleSubmit, errorBag} = useForm({
  validationSchema: getCredentialsSchema(),
  initialValues: new Credentials()
});
const onSubmit = handleSubmit(async (values: any) => {
  await userStore.login(values).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'catalog'});
    } else {
      const errors = result.error?.response?.data?.errors;
      if (Array.isArray(errors) && errors.findIndex((err) => err.code == 'INVALID_CREDENTIALS') >= 0) {
        error.value = t('login.errors.invalid');
      } else {
        emitter.emit('result-error', modalOpen(result));
      }
    }
  });
});
</script>

<template>
  <div class="container-fluid">
    <h2>{{ t('login.title') }}</h2>
    <form method="POST" @submit="onSubmit">
      <fieldset>
        <span class="error my-2" v-if="error">{{ error }}</span>
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
        <div class="col mt-4">
          <button type="submit" id="submit" name="submit" class="btn btn-primary">{{ t('login.links.login') }}</button>
          <router-link id="registration" :to="{name: 'registration'}">{{ t('registration.title') }}</router-link>
        </div>
      </fieldset>
    </form>
  </div>
  <ResultError/>
</template>
