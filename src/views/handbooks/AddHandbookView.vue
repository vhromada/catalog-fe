<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GameMenu from '../../components/games/GameMenu.vue';
import ResultError from '../../components/ResultError.vue';
import HandbookForm from '../../components/handbooks/HandbookForm.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Handbook } from '../../model/Handbook.ts';
import { GameStore } from '../../store/GameStore.ts';
import { HandbookStore } from '../../store/HandbookStore.ts';

const props = defineProps({
  game: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const gameStore = new GameStore();
const handbookStore = new HandbookStore();
const handbook = new Handbook();

gameStore.get(props.game);

async function onSubmit(request: Handbook) {
  await handbookStore.add(props.game, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'handbooks'});
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
    <h2>{{ t('handbooks.form.add') }}</h2>
    <HandbookForm :game="props.game" :handbook="handbook" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
