<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import MusicForm from '../../components/music/MusicForm.vue';
import MusicMenu from '../../components/music/MusicMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Music } from '../../model/Music.ts';
import { MusicStore } from '../../store/MusicStore.ts';

const router = useRouter();
const {t} = useI18n();
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
    <h2>{{ t('music.form.add') }}</h2>
    <MusicForm :music="music" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
