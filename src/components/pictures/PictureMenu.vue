<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../CatalogMenu.vue';

const {t} = useI18n();
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#pictureNavbarCollapse" aria-controls="pictureNavbarCollapse" aria-expanded="false"
              aria-label="Toggle picture navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="pictureNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="pictureListNavigation" class="nav-link" :to="{name: 'pictures'}">{{ t('pictures.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addPictureNavigation" class="nav-link" :to="{name: 'addPicture'}">{{ t('pictures.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
