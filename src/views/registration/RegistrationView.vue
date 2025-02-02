<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AccountForm from '../../components/accounts/AccountForm.vue';
import ResultError from '../../components/ResultError.vue';
import { Account, Credentials, type IAccount } from '../../model/Account.ts';
import { Result } from '../../model/common/Result.ts';
import { modalOpen } from '../../model/common/View.ts';
import { AccountStore } from '../../store/AccountStore.ts';
import { emitter } from '../../utils/Event.ts';

const router = useRouter();
const {t} = useI18n();
const store = new AccountStore();
const account = new Account();
const errorForm = ref('');

async function onSubmit(credentials: Credentials) {
  await store.addCredentials(credentials).then((result: Result<IAccount>) => {
    if (result.isOk()) {
      router.push({name: 'login'});
    } else {
      const errors = result.error?.response?.data?.errors;
      if (Array.isArray(errors) && errors.findIndex((err) => err.code == 'ACCOUNT_USERNAME_ALREADY_EXIST') >= 0) {
        errorForm.value = t('accounts.errors.exists');
      } else {
        emitter.emit('result-error', modalOpen(result));
      }
    }
  });
}

function onCancel() {
  router.push({name: 'login'});
}
</script>

<template>
  <div class="container-fluid">
    <h2>{{ t('registration.title') }}</h2>
    <AccountForm :account="account" :link="t('links.create')" :error="errorForm" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
