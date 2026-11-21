<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import WalkthroughForm from '../../components/walkthroughs/WalkthroughForm.vue';
import WalkthroughMenu from '../../components/walkthroughs/WalkthroughMenu.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { type IWalkthrough, Walkthrough } from '../../model/Walkthrough.ts';
import { WalkthroughStore } from '../../store/WalkthroughStore.ts';

const props = defineProps({
  game: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new WalkthroughStore();
const walkthrough = ref({} as Walkthrough);
const loaded = ref(false);

loadWalkthrough();

async function loadWalkthrough() {
  await store.get(props.game, props.uuid).then((result: Result<IWalkthrough>) => {
    if (result.isOk()) {
      walkthrough.value = new Walkthrough(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: Walkthrough) {
  await store.update(props.game, props.uuid, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'walkthroughs'});
    }
  });
}

function onCancel() {
  router.push({name: 'walkthroughs'});
}
</script>

<template>
  <WalkthroughMenu :game="props.game"/>
  <div class="container-fluid">
    <h2>{{ t('walkthroughs.form.edit') }}</h2>
    <WalkthroughForm :game="props.game" :walkthrough="walkthrough" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
