<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import CheatForm from '../../components/cheats/CheatForm.vue';
import CheatMenu from '../../components/cheats/CheatMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { ChangeCheatRequest, Cheat, type ICheat } from '../../model/Cheat.ts';
import { type IResult, Result } from '../../model/common/Result.ts';
import { CheatStore } from '../../store/CheatStore.ts';

const props = defineProps({
  game: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new CheatStore();
const cheat = ref({} as Cheat);
const loaded = ref(false);

loadCheat();

async function loadCheat() {
  await store.get(props.game, props.uuid).then((result: Result<ICheat>) => {
    if (result.isOk()) {
      cheat.value = new Cheat(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: ChangeCheatRequest) {
  await store.update(props.game, props.uuid, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'cheats'});
    }
  });
}

function onCancel() {
  router.push({name: 'cheats'});
}
</script>

<template>
  <CheatMenu :game="props.game"/>
  <div class="container-fluid">
    <h2>{{ t('cheats.form.edit') }}</h2>
    <CheatForm :game="props.game" :cheat="cheat" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
