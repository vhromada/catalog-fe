<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MusicMenu from '../music/MusicMenu.vue';

const props = defineProps({
  music: {type: String, required: true}
});
const {t} = useI18n();
</script>

<template>
  <MusicMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#songNavbarCollapse" aria-controls="songNavbarCollapse" aria-expanded="false"
              aria-label="Toggle song navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="songNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="songListNavigation" class="nav-link" :to="{name: 'songs', params: {music: props.music}}">{{ t('songs.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addSongNavigation" class="nav-link" :to="{name: 'addSong', params: {music: props.music}}">{{ t('songs.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
