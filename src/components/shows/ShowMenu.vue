<script setup lang="ts">
import CatalogMenu from '../CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#showNavbarCollapse" aria-controls="showNavbarCollapse" aria-expanded="false"
              aria-label="Toggle show navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="showNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="showListNavigation" class="nav-link" :to="{name: 'shows'}">{{ $t('shows.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addShowNavigation" class="nav-link" :to="{name: 'addShow'}">{{ $t('shows.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
