<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AccountForm from '../../components/accounts/AccountForm.vue';
import CatalogMenu from '../../components/CatalogMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Account, Credentials } from '../../model/Account.ts';
import { IResult } from '../../model/common/Result.ts';
import { modalOpen } from '../../model/common/View.ts';
import { userStore } from '../../store/UserStore.ts';
import { emitter } from '../../utils/Event.ts';

const router = useRouter();
const {t} = useI18n();
const account = new Account();
const errorForm = ref('');

async function onSubmit(credentials: Credentials) {
  await userStore.updateUser(credentials).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'catalog'});
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
  router.push({name: 'catalog'});
}
</script>

<template>
  <CatalogMenu/>
  <div class="container-fluid">
    <h2>{{ t('accounts.form.edit') }}</h2>
    <AccountForm :account="account" :link="t('links.update')" :error="errorForm" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
