<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../components/CatalogMenu.vue';
import { userStore } from '../store/UserStore.ts';

const {t} = useI18n();
const isLoggedIn = userStore.isLoggedIn();
</script>

<template>
  <CatalogMenu v-if="isLoggedIn"/>
  <div class="container-fluid">
    <h2>{{ t('errors.invalidPage') }}</h2>
  </div>
  <router-link :to="{name: 'catalog'}" v-if="!isLoggedIn">{{ t('login.links.back') }}</router-link>
</template>
