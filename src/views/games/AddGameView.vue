<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GameForm from '../../components/games/GameForm.vue';
import GameMenu from '../../components/games/GameMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Game } from '../../model/Game.ts';
import { GameStore } from '../../store/GameStore.ts';

const router = useRouter();
const {t} = useI18n();
const store = new GameStore();
const game = new Game();

async function onSubmit(game: Game) {
  await store.add(game).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'games'});
    }
  });
}

function onCancel() {
  router.push({name: 'games'});
}
</script>

<template>
  <GameMenu/>
  <div class="container-fluid">
    <h2>{{ t('games.form.add') }}</h2>
    <GameForm :game="game" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
