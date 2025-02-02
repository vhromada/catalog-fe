<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import EpisodeMenu from '../../components/episodes/EpisodeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Result } from '../../model/common/Result.ts';
import { type IEpisode } from '../../model/Episode.ts';
import { EpisodeStore } from '../../store/EpisodeStore.ts';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: String, required: true},
  uuid: {type: String, required: true}
});
const {t} = useI18n();
const store = new EpisodeStore();
const episode = ref({} as IEpisode);
const loaded = ref(false);

loadEpisode();

async function loadEpisode() {
  await store.get(props.show, props.season, props.uuid).then((result: Result<IEpisode>) => {
    if (result.isOk()) {
      episode.value = result.data!;
      loaded.value = true;
    }
  });
}
</script>

<template>
  <EpisodeMenu :show="props.show" :season="props.season"/>
  <div class="container-fluid">
    <h2>{{ t('episodes.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Episode detail">
        <tbody>
          <tr>
            <td class="title">{{ t('items.number') }}</td>
            <td>{{ episode.number }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.name') }}</td>
            <td>{{ episode.name }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.length') }}</td>
            <td>{{ episode.formattedLength }}</td>
          </tr>
          <tr v-if="episode.note">
            <td class="title">{{ t('items.note') }}</td>
            <td>{{ episode.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
