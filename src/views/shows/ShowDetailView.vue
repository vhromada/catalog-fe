<script setup lang="ts">
import { ref } from 'vue';
import ResultError from '../../components/ResultError.vue';
import ShowMenu from '../../components/shows/ShowMenu.vue';
import { formatGenres } from '../../formatters';
import { getCsfdUrl, getImdbUrl, getWikiCzUrl, getWikiEnUrl } from '../../model/common/Link.ts';
import { Result } from '../../model/common/Result.ts';
import { IShow } from '../../model/Show.ts';
import { ShowStore } from '../../store/ShowStore.ts';
import config from '../../utils/Config.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const store = new ShowStore();
const show = ref({} as IShow);
const loaded = ref(false);

loadShow();

async function loadShow() {
  await store.get(props.uuid).then((result: Result<IShow>) => {
    if (result.isOk()) {
      show.value = result.data!!;
      loaded.value = true;
    }
  });
}
</script>

<template>
  <ShowMenu/>
  <div class="container-fluid">
    <h2>{{ $t('shows.detail') }}</h2>
    <img alt="Show" class="picture" :src="`${config.catalogUrl}public/pictures/${show.picture}`" v-if="show.picture"/>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Show detail">
        <tbody>
          <tr>
            <td class="title">{{ $t('items.czechName') }}</td>
            <td>{{ show.czechName }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('items.originalName') }}</td>
            <td>{{ show.originalName }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('genres.title') }}</td>
            <td>{{ formatGenres(show.genres) }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('shows.statistics.seasons') }}</td>
            <td>{{ show.seasonsCount }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('shows.statistics.episodes') }}</td>
            <td>{{ show.episodesCount }}</td>
          </tr>
          <tr v-if="show.episodesCount > 0">
            <td class="title">{{ $t('common.totalLength') }}</td>
            <td>{{ show.formattedLength }}</td>
          </tr>
          <tr v-if="show.note">
            <td class="title">{{ $t('items.note') }}</td>
            <td>{{ show.note }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <router-link :to="{name: 'seasons', params: {show: show.uuid}}">{{ $t('seasons.title') }}</router-link>
            </td>
          </tr>
          <tr v-if="show.csfd">
            <td colspan="2">
              <a target="_blank" :href="getCsfdUrl(show)">{{ $t('items.csfd') }}</a>
            </td>
          </tr>
          <tr v-if="show.imdbCode && show.imdbCode > 0">
            <td colspan="2">
              <a target="_blank" :href="getImdbUrl(show)">{{ $t('items.imdb') }}</a>
            </td>
          </tr>
          <tr v-if="show.wikiCz">
            <td colspan="2">
              <a target="_blank" :href="getWikiCzUrl(show)">{{ $t('items.wikiCz') }}</a>
            </td>
          </tr>
          <tr v-if="show.wikiEn">
            <td colspan="2">
              <a target="_blank" :href="getWikiEnUrl(show)">{{ $t('items.wikiEn') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
