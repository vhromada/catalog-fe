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
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#walkthroughNavbarCollapse" aria-controls="walkthroughNavbarCollapse" aria-expanded="false"
              aria-label="Toggle walkthrough navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="walkthroughNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="walkthroughsNavigation" class="nav-link" :to="{name: 'walkthroughs', params: {game: props.game}}">{{ t('walkthroughs.menu.list') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
