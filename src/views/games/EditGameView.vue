<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GameForm from '../../components/games/GameForm.vue';
import GameMenu from '../../components/games/GameMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult, Result } from '../../model/common/Result.ts';
import { Game, IGame } from '../../model/Game.ts';
import { GameStore } from '../../store/GameStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new GameStore();
const game = ref({} as Game);
const loaded = ref(false);

loadGame();

async function loadGame() {
  await store.get(props.uuid).then((result: Result<IGame>) => {
    if (result.isOk()) {
      game.value = new Game(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(game: Game) {
  await store.update(props.uuid, game).then((result: IResult) => {
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
    <h2>{{ $t('games.form.edit') }}</h2>
    <GameForm :game="game" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
