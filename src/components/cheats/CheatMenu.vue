<script setup lang="ts">
import GameMenu from '../games/GameMenu.vue';

const props = defineProps({
  game: {type: String, required: true}
});
</script>

<template>
  <GameMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#cheatNavbarCollapse" aria-controls="cheatNavbarCollapse" aria-expanded="false"
              aria-label="Toggle cheat navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="cheatNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="cheatsNavigation" class="nav-link" :to="{name: 'cheats', params: {game: props.game}}">{{ $t('cheats.menu.list') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
