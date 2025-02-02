<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../CatalogMenu.vue';

const {t} = useI18n();
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#movieNavbarCollapse" aria-controls="movieNavbarCollapse" aria-expanded="false"
              aria-label="Toggle movie navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="movieNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="movieListNavigation" class="nav-link" :to="{name: 'movies'}">{{ t('movies.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addMovieNavigation" class="nav-link" :to="{name: 'addMovie'}">{{ t('movies.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
