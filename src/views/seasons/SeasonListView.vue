<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ResultError from '../../components/ResultError.vue';
import SeasonMenu from '../../components/seasons/SeasonMenu.vue';
import { SeasonStore } from '../../store/SeasonStore.ts';

const props = defineProps({
  show: {type: String, required: true}
});
const {t} = useI18n();
const store = new SeasonStore();

store.load(props.show);

async function duplicate(uuid: string) {
  await store.duplicate(props.show, uuid);
}

async function remove(uuid: string) {
  await store.remove(props.show, uuid);
}

async function first() {
  await store.first(props.show);
}

async function previous() {
  await store.previous(props.show);
}

async function next() {
  await store.next(props.show);
}

async function last() {
  await store.last(props.show);
}
</script>

<template>
  <SeasonMenu :show="props.show"/>
  <div class="container-fluid">
    <h2>{{ t('seasons.title') }}</h2>
    <div class="table-responsive" v-if="store.exists()">
      <table id="seasons" class="table table-hover" aria-describedby="List of seasons">
        <thead>
          <tr>
            <th data-nav="name">{{ t('seasons.header') }}</th>
            <th data-nav="episodes"></th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="season in store.seasons.value" :key="season.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'seasonDetail', params: {show: props.show, uuid: season.uuid}}">{{ season.number }}</router-link>
            </td>
            <td data-nav="episodes">
              <router-link :to="{name: 'episodes', params: {show: props.show, season: season.uuid}}">{{ t('episodes.title') }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(season.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editSeason', params: {show: props.show, uuid: season.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(season.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Seasons pagination" v-if="store.isPagingAllowed()">
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
    <span id="noData" v-if="!store.exists">{{ t('seasons.noData') }}</span>
  </div>
  <ResultError/>
</template>
