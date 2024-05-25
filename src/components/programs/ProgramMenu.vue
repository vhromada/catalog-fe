<script setup lang="ts">
import CatalogMenu from '../CatalogMenu.vue';
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#programNavbarCollapse" aria-controls="programNavbarCollapse" aria-expanded="false"
              aria-label="Toggle program navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="programNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="programListNavigation" class="nav-link" :to="{name: 'programs'}">{{ $t('programs.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addProgramNavigation" class="nav-link" :to="{name: 'addProgram'}">{{ $t('programs.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
