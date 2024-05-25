<script setup lang="ts">
import { ref } from 'vue';
import MovieMenu from '../../components/movies/MovieMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { formatGenres } from '../../formatters';
import { getCsfdUrl, getImdbUrl, getWikiCzUrl, getWikiEnUrl } from '../../model/common/Link.ts';
import { Result } from '../../model/common/Result.ts';
import { IMovie } from '../../model/Movie.ts';
import { MovieStore } from '../../store/MovieStore.ts';
import config from '../../utils/Config.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const store = new MovieStore();
const movie = ref({} as IMovie);
const loaded = ref(false);

loadMovie();

async function loadMovie() {
  await store.get(props.uuid).then((result: Result<IMovie>) => {
    if (result.isOk()) {
      movie.value = result.data!!;
      loaded.value = true;
    }
  });
}

function formatMedia(): string {
  return movie.value.media.map((medium) => medium.formattedLength).join(', ');
}
</script>

<template>
  <MovieMenu/>
  <div class="container-fluid">
    <h2>{{ $t('movies.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <img alt="Movie" class="picture" :src="`${config.catalogUrl}public/pictures/${movie.picture}`" v-if="movie.picture"/>
      <table class="table table-hover" aria-hidden="true" aria-describedby="Movie detail">
        <tbody>
          <tr>
            <td class="title">{{ $t('items.czechName') }}</td>
            <td>{{ movie.czechName }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('items.originalName') }}</td>
            <td>{{ movie.originalName }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('genres.title') }}</td>
            <td>{{ formatGenres(movie.genres) }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('movies.items.year') }}</td>
            <td>{{ movie.year }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('items.languages') }}</td>
            <td>{{ movie.languages.map((languages) => $t(`registers.${languages}`)).join(', ') }}</td>
          </tr>
          <tr v-if="movie.subtitles && movie.subtitles.length > 0">
            <td class="title">{{ $t('items.subtitles') }}</td>
            <td>{{ movie.subtitles.map((subtitles) => $t(`registers.${subtitles}`)).join(', ') }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('movies.items.media') }}</td>
            <td>{{ formatMedia() }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('common.totalLength') }}</td>
            <td>{{ movie.formattedLength }}</td>
          </tr>
          <tr v-if="movie.note">
            <td class="title">{{ $t('items.note') }}</td>
            <td>{{ movie.note }}</td>
          </tr>
          <tr v-if="movie.csfd">
            <td colspan="2">
              <a target="_blank" :href="getCsfdUrl(movie)">{{ $t('items.csfd') }}</a>
            </td>
          </tr>
          <tr v-if="movie.imdbCode && movie.imdbCode > 0">
            <td colspan="2">
              <a target="_blank" :href="getImdbUrl(movie)">{{ $t('items.imdb') }}</a>
            </td>
          </tr>
          <tr v-if="movie.wikiCz">
            <td colspan="2">
              <a target="_blank" :href="getWikiCzUrl(movie)">{{ $t('items.wikiCz') }}</a>
            </td>
          </tr>
          <tr v-if="movie.wikiEn">
            <td colspan="2">
              <a target="_blank" :href="getWikiEnUrl(movie)">{{ $t('items.wikiEn') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
