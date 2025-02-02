<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import SongForm from '../../components/songs/SongForm.vue';
import SongMenu from '../../components/songs/SongMenu.vue';
import { type IResult } from '../../model/common/Result.ts';
import { ChangeSongRequest, Song } from '../../model/Song.ts';
import { MusicStore } from '../../store/MusicStore.ts';
import { SongStore } from '../../store/SongStore.ts';

const props = defineProps({
  music: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const musicStore = new MusicStore();
const songStore = new SongStore();
const song = new Song();

musicStore.get(props.music);

async function onSubmit(request: ChangeSongRequest) {
  await songStore.add(props.music, request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'songs'});
    }
  });
}

function onCancel() {
  router.push({name: 'songs'});
}
</script>

<template>
  <SongMenu :music="props.music"/>
  <div class="container-fluid">
    <h2>{{ t('songs.form.add') }}</h2>
    <SongForm :music="props.music" :song="song" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
