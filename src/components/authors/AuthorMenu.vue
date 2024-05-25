<script setup lang="ts">
import CatalogMenu from '../CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#authorNavbarCollapse" aria-controls="authorNavbarCollapse" aria-expanded="false"
              aria-label="Toggle author navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="authorNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="authorListNavigation" class="nav-link" :to="{name: 'authors'}">{{ $t('authors.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addAuthorNavigation" class="nav-link" :to="{name: 'addAuthor'}">{{ $t('authors.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>