<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import ShowForm from '../../components/shows/ShowForm.vue';
import ShowMenu from '../../components/shows/ShowMenu.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { ChangeShowRequest, type IShow, Show } from '../../model/Show.ts';
import { ShowStore } from '../../store/ShowStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new ShowStore();
const show = ref({} as Show);
const loaded = ref(false);

loadShow();

async function loadShow() {
  await store.get(props.uuid).then((result: Result<IShow>) => {
    if (result.isOk()) {
      show.value = new Show(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: ChangeShowRequest) {
  await store.update(props.uuid, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'shows'});
    }
  });
}

function onCancel() {
  router.push({name: 'shows'});
}
</script>

<template>
  <ShowMenu/>
  <div class="container-fluid">
    <h2>{{ t('shows.form.edit') }}</h2>
    <ShowForm :show="show" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
