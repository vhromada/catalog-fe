<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EpisodeForm from '../../components/episodes/EpisodeForm.vue';
import EpisodeMenu from '../../components/episodes/EpisodeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult, Result } from '../../model/common/Result.ts';
import { ChangeEpisodeRequest, Episode, IEpisode } from '../../model/Episode.ts';
import { EpisodeStore } from '../../store/EpisodeStore.ts';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new EpisodeStore();
const episode = ref({} as Episode);
const loaded = ref(false);

loadEpisode();

async function loadEpisode() {
  await store.get(props.show, props.season, props.uuid).then((result: Result<IEpisode>) => {
    if (result.isOk()) {
      episode.value = new Episode(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: ChangeEpisodeRequest) {
  await store.update(props.show, props.season, props.uuid, request).then((result: IResult) => {
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
    <h2>{{ $t('episodes.form.edit') }}</h2>
    <EpisodeForm :show="props.show" :season="props.season" :episode="episode" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
