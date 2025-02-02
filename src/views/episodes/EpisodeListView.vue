<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import EpisodeMenu from '../../components/episodes/EpisodeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { EpisodeStore } from '../../store/EpisodeStore.ts';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: String, required: true}
});
const {t} = useI18n();
const store = new EpisodeStore();

store.load(props.show, props.season);

async function duplicate(uuid: string) {
  await store.duplicate(props.show, props.season, uuid);
}

async function remove(uuid: string) {
  await store.remove(props.show, props.season, uuid);
}

async function first() {
  await store.first(props.show, props.season);
}

async function previous() {
  await store.previous(props.show, props.season);
}

async function next() {
  await store.next(props.show, props.season);
}

async function last() {
  await store.last(props.show, props.season);
}
</script>

<template>
  <EpisodeMenu :show="props.show" :season="props.season"/>
  <div class="container-fluid">
    <h2>{{ t('episodes.title') }}</h2>
    <div class="table-responsive" v-if="store.exists()">
      <table id="episodes" class="table table-hover" aria-describedby="List of episodes">
        <thead>
          <tr>
            <th data-nav="name">{{ t('episodes.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="episode in store.episodes.value" :key="episode.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'episodeDetail', params: {show: props.show, season: props.season, uuid: episode.uuid}}">{{ episode.name }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(episode.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editEpisode', params: {show: props.show, season: props.season, uuid: episode.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(episode.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Episodes pagination" v-if="store.isPagingAllowed()">
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
    <span id="noData" v-if="!store.exists">{{ t('episodes.noData') }}</span>
  </div>
  <ResultError/>
</template>
