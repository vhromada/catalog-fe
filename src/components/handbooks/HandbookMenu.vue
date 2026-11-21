<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GameMenu from '../games/GameMenu.vue';

const props = defineProps({
  game: {type: String, required: true}
});
const {t} = useI18n();
</script>

<template>
  <GameMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#handbookNavbarCollapse" aria-controls="handbookNavbarCollapse" aria-expanded="false"
              aria-label="Toggle handbook navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="handbookNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="handbooksNavigation" class="nav-link" :to="{name: 'handbooks', params: {game: props.game}}">{{ t('handbooks.menu.list') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
