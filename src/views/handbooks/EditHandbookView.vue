<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import HandbookForm from '../../components/handbooks/HandbookForm.vue';
import HandbookMenu from '../../components/handbooks/HandbookMenu.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { type IHandbook, Handbook } from '../../model/Handbook.ts';
import { HandbookStore } from '../../store/HandbookStore.ts';

const props = defineProps({
  game: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new HandbookStore();
const handbook = ref({} as Handbook);
const loaded = ref(false);

loadHandbook();

async function loadHandbook() {
  await store.get(props.game, props.uuid).then((result: Result<IHandbook>) => {
    if (result.isOk()) {
      handbook.value = new Handbook(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: Handbook) {
  await store.update(props.game, props.uuid, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'handbooks'});
    }
  });
}

function onCancel() {
  router.push({name: 'handbooks'});
}
</script>

<template>
  <HandbookMenu :game="props.game"/>
  <div class="container-fluid">
    <h2>{{ t('handbooks.form.edit') }}</h2>
    <HandbookForm :game="props.game" :handbook="handbook" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
