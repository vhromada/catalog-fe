<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import SeasonForm from '../../components/seasons/SeasonForm.vue';
import SeasonMenu from '../../components/seasons/SeasonMenu.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Season } from '../../model/Season.ts';
import { SeasonStore } from '../../store/SeasonStore.ts';
import { ShowStore } from '../../store/ShowStore.ts';

const props = defineProps({
  show: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const showStore = new ShowStore();
const seasonStore = new SeasonStore();
const season = new Season();

showStore.get(props.show);

async function onSubmit(season: Season) {
  await seasonStore.add(props.show, season).then((result: IResult) => {
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
    <h2>{{ t('seasons.form.add') }}</h2>
    <SeasonForm :show="props.show" :season="season" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
