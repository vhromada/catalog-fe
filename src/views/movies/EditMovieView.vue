<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import MovieForm from '../../components/movies/MovieForm.vue';
import MovieMenu from '../../components/movies/MovieMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { ChangeMovieRequest, type IMovie, Movie } from '../../model/Movie.ts';
import { MovieStore } from '../../store/MovieStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new MovieStore();
const movie = ref({} as Movie);
const loaded = ref(false);

loadMovie();

async function loadMovie() {
  await store.get(props.uuid).then((result: Result<IMovie>) => {
    if (result.isOk()) {
      movie.value = new Movie(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: ChangeMovieRequest) {
  await store.update(props.uuid, request).then((result: IResult) => {
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
    <h2>{{ t('movies.form.edit') }}</h2>
    <MovieForm :movie="movie" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
