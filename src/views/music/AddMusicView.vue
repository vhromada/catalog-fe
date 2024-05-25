<script setup lang="ts">
import { useRouter } from 'vue-router';
import MusicForm from '../../components/music/MusicForm.vue';
import MusicMenu from '../../components/music/MusicMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult } from '../../model/common/Result.ts';
import { Music } from '../../model/Music.ts';
import { MusicStore } from '../../store/MusicStore.ts';

const router = useRouter();
const store = new MusicStore();
const music = new Music();

async function onSubmit(music: Music) {
  await store.add(music).then((result: IResult) => {
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
    <h2>{{ $t('music.form.add') }}</h2>
    <MusicForm :music="music" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
