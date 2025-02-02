<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ResultError from '../../components/ResultError.vue';
import SeasonMenu from '../../components/seasons/SeasonMenu.vue';
import { Result } from '../../model/common/Result.ts';
import { type ISeason } from '../../model/Season.ts';
import { SeasonStore } from '../../store/SeasonStore.ts';

const props = defineProps({
  show: {type: String, required: true},
  uuid: {type: String, required: true}
});
const store = new SeasonStore();
const {t} = useI18n();
const season = ref({} as ISeason);
const loaded = ref(false);

loadSeason();

async function loadSeason() {
  await store.get(props.show, props.uuid).then((result: Result<ISeason>) => {
    season.value = result.data!;
    loaded.value = true;
  });
}

function formatYears(): string {
  if (season.value.startYear == season.value.endYear) {
    return season.value.startYear.toString();
  } else {
    return season.value.startYear + ' - ' + season.value.endYear;
  }
}
</script>

<template>
  <SeasonMenu :show="props.show"/>
  <div class="container-fluid">
    <h2>{{ t('seasons.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Season detail">
        <tbody>
          <tr>
            <td class="title">{{ t('items.number') }}</td>
            <td>{{ season.number }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('seasons.items.years') }}</td>
            <td>{{ formatYears() }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.language') }}</td>
            <td>{{ t(`registers.${season.language}`) }}</td>
          </tr>
          <tr v-if="season.subtitles && season.subtitles.length > 0">
            <td class="title">{{ t('items.subtitles') }}</td>
            <td>{{ season.subtitles.map((subtitles => t(`registers.${subtitles}`))).join(', ') }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('shows.statistics.episodes') }}</td>
            <td>{{ season.episodesCount }}</td>
          </tr>
          <tr v-if="season.episodesCount > 0">
            <td class="title">{{ t('common.totalLength') }}</td>
            <td>{{ season.formattedLength }}</td>
          </tr>
          <tr v-if="season.note">
            <td class="title">{{ t('items.note') }}</td>
            <td>{{ season.note }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <router-link :to="{name: 'episodes', params: {show: props.show, season: season.uuid}}">{{ t('episodes.title') }}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
