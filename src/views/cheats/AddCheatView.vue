<script setup lang="ts">
import { useRouter } from 'vue-router';
import CheatForm from '../../components/cheats/CheatForm.vue';
import GameMenu from '../../components/games/GameMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { ChangeCheatRequest, Cheat } from '../../model/Cheat.ts';
import { IResult } from '../../model/common/Result.ts';
import { CheatStore } from '../../store/CheatStore.ts';
import { GameStore } from '../../store/GameStore.ts';

const props = defineProps({
  game: {type: String, required: true}
});
const router = useRouter();
const gameStore = new GameStore();
const cheatStore = new CheatStore();
const cheat = new Cheat();

gameStore.get(props.game);

async function onSubmit(request: ChangeCheatRequest) {
  await cheatStore.add(props.game, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'cheats'});
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
    <h2>{{ $t('cheats.form.add') }}</h2>
    <CheatForm :game="props.game" :cheat="cheat" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
