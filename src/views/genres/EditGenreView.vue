<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GenreForm from '../../components/genres/GenreForm.vue';
import GenreMenu from '../../components/genres/GenreMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult, Result } from '../../model/common/Result.ts';
import { Genre, IGenre } from '../../model/Genre.ts';
import { GenreStore } from '../../store/GenreStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new GenreStore();
const genre = ref({} as Genre);
const loaded = ref(false);

loadGenre();

async function loadGenre() {
  await store.get(props.uuid).then((result: Result<IGenre>) => {
    if (result.isOk()) {
      genre.value = new Genre(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(genre: Genre) {
  await store.update(props.uuid, genre).then((result: IResult) => {
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
    <h2>{{ $t('genres.form.edit') }}</h2>
    <GenreForm :genre="genre" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
