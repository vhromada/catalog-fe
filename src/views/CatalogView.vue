<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../components/CatalogMenu.vue';

const {t} = useI18n();
</script>

<template>
  <CatalogMenu/>
  <div class="container-fluid">
    <h2>{{ t('app.title') }}</h2>
    {{ t('app.description') }}
  </div>
</template>
