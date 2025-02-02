<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../CatalogMenu.vue';

const {t} = useI18n();
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#jokeNavbarCollapse" aria-controls="jokeNavbarCollapse" aria-expanded="false"
              aria-label="Toggle joke navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="jokeNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="jokeListNavigation" class="nav-link" :to="{name: 'jokes'}">{{ t('jokes.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addJokeNavigation" class="nav-link" :to="{name: 'addJoke'}">{{ t('jokes.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
