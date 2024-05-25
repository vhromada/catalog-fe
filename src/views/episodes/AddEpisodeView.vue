<script setup lang="ts">
import { useRouter } from 'vue-router';
import EpisodeForm from '../../components/episodes/EpisodeForm.vue';
import EpisodeMenu from '../../components/episodes/EpisodeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult } from '../../model/common/Result.ts';
import { ChangeEpisodeRequest, Episode } from '../../model/Episode.ts';
import { EpisodeStore } from '../../store/EpisodeStore.ts';
import { SeasonStore } from '../../store/SeasonStore.ts';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: String, required: true}
});
const router = useRouter();
const seasonStore = new SeasonStore();
const episodeStore = new EpisodeStore();
const episode = new Episode();

seasonStore.get(props.show, props.season);

async function onSubmit(request: ChangeEpisodeRequest) {
  await episodeStore.add(props.show, props.season, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'episodes'});
    }
  });
}

function onCancel() {
  router.push({name: 'episodes'});
}
</script>

<template>
  <EpisodeMenu :show="props.show" :season="props.season"/>
  <div class="container-fluid">
    <h2>{{ $t('episodes.form.add') }}</h2>
    <EpisodeForm :show="props.show" :season="props.season" :episode="episode" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
