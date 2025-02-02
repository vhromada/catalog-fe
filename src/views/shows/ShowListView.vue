<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MultipleNameSearchForm from '../../components/MultipleNameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import ShowMenu from '../../components/shows/ShowMenu.vue';
import { ShowStore } from '../../store/ShowStore.ts';

const {t} = useI18n();
const store = new ShowStore();

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
  <ShowMenu/>
  <div class="container-fluid">
    <h2>{{ t('shows.title') }}</h2>
    <MultipleNameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="shows" class="table table-hover" aria-describedby="List of shows">
        <thead>
          <tr>
            <th data-nav="name">{{ t('shows.header') }}</th>
            <th data-nav="seasons"></th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="show in store.shows.value" :key="show.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'showDetail', params: {uuid: show.uuid}}">{{ show.czechName }}</router-link>
            </td>
            <td data-nav="seasons">
              <router-link :to="{name: 'seasons', params: {show: show.uuid}}">{{ t('seasons.title') }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(show.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editShow', params: {uuid: show.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(show.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Shows pagination" v-if="store.isPagingAllowed()">
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
      <table id="statistics" class="table" aria-describedby="Statistics for shows">
        <thead>
          <tr>
            <th data-nav="count">{{ t('shows.statistics.count') }}</th>
            <th data-nav="seasonsCount">{{ t('shows.statistics.seasons') }}</th>
            <th data-nav="episodesCount">{{ t('shows.statistics.episodes') }}</th>
            <th data-nav="totalLength">{{ t('common.totalLength') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
            <td data-nav="seasonsCount">{{ store.statistics.value.seasonsCount }}</td>
            <td data-nav="episodesCount">{{ store.statistics.value.episodesCount }}</td>
            <td data-nav="totalLength">{{ store.statistics.value.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
