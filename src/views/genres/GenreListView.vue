<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GenreMenu from '../../components/genres/GenreMenu.vue';
import NameSearchForm from '../../components/NameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { GenreStore } from '../../store/GenreStore.ts';

const {t} = useI18n();
const store = new GenreStore();

store.load();

async function duplicate(uuid: string) {
  await store.duplicate(uuid);
}

async function remove(uuid: string) {
  await store.remove(uuid);
}

async function search(name: string) {
  await store.search(name);
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
  <GenreMenu/>
  <div class="container-fluid">
    <h2>{{ t('genres.title') }}</h2>
    <NameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="genres" class="table table-hover" aria-describedby="List of genres">
        <thead>
          <tr>
            <th data-nav="name">{{ t('genres.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="genre in store.genres.value" :key="genre.uuid">
            <td data-nav="name">{{ genre.name }}</td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(genre.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editGenre', params: {uuid: genre.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(genre.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Genres pagination" v-if="store.isPagingAllowed()">
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
      <table id="statistics" class="table" aria-describedby="Statistics for genres">
        <thead>
          <tr>
            <th data-nav="count">{{ t('genres.statistics.count') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
