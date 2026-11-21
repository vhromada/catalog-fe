<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GameMenu from '../../components/games/GameMenu.vue';
import ResultError from '../../components/ResultError.vue';
import WalkthroughForm from '../../components/walkthroughs/WalkthroughForm.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Walkthrough } from '../../model/Walkthrough.ts';
import { GameStore } from '../../store/GameStore.ts';
import { WalkthroughStore } from '../../store/WalkthroughStore.ts';

const props = defineProps({
  game: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const gameStore = new GameStore();
const walkthroughStore = new WalkthroughStore();
const walkthrough = new Walkthrough();

gameStore.get(props.game);

async function onSubmit(request: Walkthrough) {
  await walkthroughStore.add(props.game, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'walkthroughs'});
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
    <h2>{{ t('walkthroughs.form.add') }}</h2>
    <WalkthroughForm :game="props.game" :walkthrough="walkthrough" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
