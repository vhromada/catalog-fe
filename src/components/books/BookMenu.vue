<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../CatalogMenu.vue';

const {t} = useI18n();
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#bookNavbarCollapse" aria-controls="bookNavbarCollapse" aria-expanded="false"
              aria-label="Toggle book navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="bookNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="bookListNavigation" class="nav-link" :to="{name: 'books'}">{{ t('books.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addBookNavigation" class="nav-link" :to="{name: 'addBook'}">{{ t('books.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
