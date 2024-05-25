<script setup lang="ts">
import CatalogMenu from '../CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#genreNavbarCollapse" aria-controls="genreNavbarCollapse" aria-expanded="false"
              aria-label="Toggle genre navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="genreNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="genreListNavigation" class="nav-link" :to="{name: 'genres'}">{{ $t('genres.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addGenreNavigation" class="nav-link" :to="{name: 'addGenre'}">{{ $t('genres.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
