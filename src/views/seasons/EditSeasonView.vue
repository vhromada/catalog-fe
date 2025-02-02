<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import SeasonForm from '../../components/seasons/SeasonForm.vue';
import SeasonMenu from '../../components/seasons/SeasonMenu.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { type ISeason, Season } from '../../model/Season.ts';
import { SeasonStore } from '../../store/SeasonStore.ts';

const props = defineProps({
  show: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new SeasonStore();
const season = ref({} as Season);
const loaded = ref(false);

loadSeason();

async function loadSeason() {
  await store.get(props.show, props.uuid).then((result: Result<ISeason>) => {
    season.value = new Season(result.data!);
    loaded.value = true;
  });
}

async function onSubmit(season: Season) {
  await store.update(props.show, props.uuid, season).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'seasons'});
    }
  });
}

function onCancel() {
  router.push({name: 'seasons'});
}
</script>

<template>
  <SeasonMenu :show="props.show"/>
  <div class="container-fluid">
    <h2>{{ t('seasons.form.edit') }}</h2>
    <SeasonForm :show="props.show" :season="season" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
