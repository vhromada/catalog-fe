<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SeasonMenu from '../seasons/SeasonMenu.vue';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: String, required: true}
});
const {t} = useI18n();
</script>

<template>
  <SeasonMenu :show="props.show"/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#episodeNavbarCollapse" aria-controls="episodeNavbarCollapse" aria-expanded="false"
              aria-label="Toggle episode navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="episodeNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="episodeListNavigation" class="nav-link" :to="{name: 'episodes', params: {show: props.show, season: props.season}}">{{ t('episodes.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addEpisodeNavigation" class="nav-link" :to="{name: 'addEpisode', params: {show: props.show, season: props.season}}">{{ t('episodes.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
