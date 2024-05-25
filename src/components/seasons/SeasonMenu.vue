<script setup lang="ts">
import ShowMenu from '../shows/ShowMenu.vue';

const props = defineProps({
  show: {type: String, required: true}
});
</script>

<template>
  <ShowMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#seasonNavbarCollapse" aria-controls="seasonNavbarCollapse" aria-expanded="false"
              aria-label="Toggle season navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="seasonNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="seasonListNavigation" class="nav-link" :to="{name: 'seasons', params: {show: props.show}}">{{ $t('seasons.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addSeasonNavigation" class="nav-link" :to="{name: 'addSeason', params: {show: props.show}}">{{ $t('seasons.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
