<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GenreForm from '../../components/genres/GenreForm.vue';
import GenreMenu from '../../components/genres/GenreMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Genre } from '../../model/Genre.ts';
import { GenreStore } from '../../store/GenreStore.ts';

const router = useRouter();
const {t} = useI18n();
const store = new GenreStore();
const genre = new Genre();

async function onSubmit(genre: Genre) {
  await store.add(genre).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'genres'});
    }
  });
}

function onCancel() {
  router.push({name: 'genres'});
}
</script>

<template>
  <GenreMenu/>
  <div class="container-fluid">
    <h2>{{ t('genres.form.add') }}</h2>
    <GenreForm :genre="genre" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
