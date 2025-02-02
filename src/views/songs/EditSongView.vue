<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import SongForm from '../../components/songs/SongForm.vue';
import SongMenu from '../../components/songs/SongMenu.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { ChangeSongRequest, type ISong, Song } from '../../model/Song.ts';
import { SongStore } from '../../store/SongStore.ts';

const props = defineProps({
  music: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new SongStore();
const song = ref({} as Song);
const loaded = ref(false);

loadSong();

async function loadSong() {
  await store.get(props.music, props.uuid).then((result: Result<ISong>) => {
    if (result.isOk()) {
      song.value = new Song(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: ChangeSongRequest) {
  await store.update(props.music, props.uuid, request).then((result: IResult) => {
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
    <h2>{{ t('songs.form.edit') }}</h2>
    <SongForm :music="props.music" :song="song" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
