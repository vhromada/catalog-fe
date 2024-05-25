<script setup lang="ts">
import { useRouter } from 'vue-router';
import MovieForm from '../../components/movies/MovieForm.vue';
import MovieMenu from '../../components/movies/MovieMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult } from '../../model/common/Result.ts';
import { ChangeMovieRequest, Movie } from '../../model/Movie.ts';
import { MovieStore } from '../../store/MovieStore.ts';

const router = useRouter();
const store = new MovieStore();
const movie = new Movie();

async function onSubmit(request: ChangeMovieRequest) {
  await store.add(request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'movies'});
    }
  });
}

function onCancel() {
  router.push({name: 'movies'});
}
</script>

<template>
  <MovieMenu/>
  <div class="container-fluid">
    <h2>{{ $t('movies.form.add') }}</h2>
    <MovieForm :movie="movie" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
