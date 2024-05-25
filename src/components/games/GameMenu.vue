<script setup lang="ts">
import CatalogMenu from '../CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#gameNavbarCollapse" aria-controls="gameNavbarCollapse" aria-expanded="false"
              aria-label="Toggle game navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="gameNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="gameListNavigation" class="nav-link" :to="{name: 'games'}">{{ $t('games.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addGameNavigation" class="nav-link" :to="{name: 'addGame'}">{{ $t('games.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
