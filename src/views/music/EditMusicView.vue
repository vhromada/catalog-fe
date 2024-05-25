<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MusicForm from '../../components/music/MusicForm.vue';
import MusicMenu from '../../components/music/MusicMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult, Result } from '../../model/common/Result.ts';
import { IMusic, Music } from '../../model/Music.ts';
import { MusicStore } from '../../store/MusicStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new MusicStore();
const music = ref({} as Music);
const loaded = ref(false);

loadMusic();

async function loadMusic() {
  await store.get(props.uuid).then((result: Result<IMusic>) => {
    if (result.isOk()) {
      music.value = new Music(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(music: Music) {
  await store.update(props.uuid, music).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'musicList'});
    }
  });
}

function onCancel() {
  router.push({name: 'musicList'});
}
</script>

<template>
  <MusicMenu/>
  <div class="container-fluid">
    <h2>{{ $t('music.form.edit') }}</h2>
    <MusicForm :music="music" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
