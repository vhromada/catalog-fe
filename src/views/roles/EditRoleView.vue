<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import CatalogMenu from '../../components/CatalogMenu.vue';
import ResultError from '../../components/ResultError.vue';
import RoleForm from '../../components/roles/RoleForm.vue';
import { ChangeRoles, type IAccount } from '../../model/Account.ts';
import { type IResult, Result } from '../../model/common/Result.ts';
import { AccountStore } from '../../store/AccountStore.ts';
import { userStore } from '../../store/UserStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new AccountStore();
const changeRoles = ref({} as ChangeRoles);
const loaded = ref(false);

loadAccount();

async function loadAccount() {
  await store.get(props.uuid).then((result: Result<IAccount>) => {
    if (result.isOk()) {
      changeRoles.value = new ChangeRoles(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(roles: ChangeRoles) {
  await userStore.updateRoles(props.uuid!, roles).then((result: IResult) => {
    if (result.isOk()) {
      if (userStore.isAdmin()) {
        router.push({name: 'accounts'});
      } else {
        router.push({name: 'catalog'});
      }
    }
  });
}

function onCancel() {
  router.push({name: 'accounts'});
}
</script>

<template>
  <CatalogMenu/>
  <div class="container-fluid">
    <h2>{{ t('roles.title') }}</h2>
    <RoleForm :role="changeRoles" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
