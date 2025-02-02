<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MovieMenu from '../../components/movies/MovieMenu.vue';
import MultipleNameSearchForm from '../../components/MultipleNameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { MovieStore } from '../../store/MovieStore.ts';

const {t} = useI18n();
const store = new MovieStore();

store.load();

async function duplicate(uuid: string) {
  await store.duplicate(uuid);
}

async function remove(uuid: string) {
  await store.remove(uuid);
}

async function search(czechName: string, originalName: string) {
  await store.search(czechName, originalName);
}

async function first() {
  await store.first();
}

async function previous() {
  await store.previous();
}

async function next() {
  await store.next();
}

async function last() {
  await store.last();
}
</script>

<template>
  <MovieMenu/>
  <div class="container-fluid">
    <h2>{{ t('movies.title') }}</h2>
    <MultipleNameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="movies" class="table table-hover" aria-describedby="List of movies">
        <thead>
          <tr>
            <th data-nav="name">{{ t('movies.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in store.movies.value" :key="movie.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'movieDetail', params: {uuid: movie.uuid}}">{{ movie.czechName }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(movie.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editMovie', params: {uuid: movie.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(movie.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Movies pagination" v-if="store.isPagingAllowed()">
      <ul class="pagination justify-content-center">
        <li class="page-item" v-if="store.canPrevious()">
          <a id="first" href="#" class="page-link" aria-label="First" @click="first()">&laquo;&laquo;</a>
        </li>
        <li class="page-item" v-if="store.canPrevious()">
          <a id="previous" href="#" class="page-link" aria-label="Previous" @click="previous()">&laquo;</a>
        </li>
        <li class="page-item">
          <a id="pageInfo" href="#" class="page-link disabled">{{ store.getPage() }}</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="next" href="#" class="page-link" aria-label="Next" @click="next()">&raquo;</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="last" href="#" class="page-link" aria-label="Last" @click="last()">&raquo;&raquo;</a>
        </li>
      </ul>
    </nav>
    <div class="table-responsive">
      <table id="statistics" class="table" aria-describedby="Statistics for movies">
        <thead>
          <tr>
            <th data-nav="count">{{ t('movies.statistics.count') }}</th>
            <th data-nav="totalLength">{{ t('common.totalLength') }}</th>
            <th data-nav="mediaCount">{{ t('items.mediaCount') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
            <td data-nav="totalLength">{{ store.statistics.value.length }}</td>
            <td data-nav="mediaCount">{{ store.statistics.value.mediaCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
