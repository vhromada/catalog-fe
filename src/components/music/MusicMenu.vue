<script setup lang="ts">
import CatalogMenu from '../CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#musicNavbarCollapse" aria-controls="musicNavbarCollapse" aria-expanded="false"
              aria-label="Toggle music navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="musicNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="musicListNavigation" class="nav-link" :to="{name: 'musicList'}">{{ $t('music.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addMusicNavigation" class="nav-link" :to="{name: 'addMusic'}">{{ $t('music.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
