<script setup lang="ts">
import CatalogMenu from '../components/CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="container-fluid">
    <h2>{{ $t('app.title') }}</h2>
    {{ $t('app.description') }}
  </div>
</template>
