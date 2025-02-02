<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GameMenu from '../../components/games/GameMenu.vue';
import NameSearchForm from '../../components/NameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { GameStore } from '../../store/GameStore.ts';

const {t} = useI18n();
const store = new GameStore();

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
  <GameMenu/>
  <div class="container-fluid">
    <h2>{{ t('games.title') }}</h2>
    <NameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="games" class="table table-hover" aria-describedby="List of games">
        <thead>
          <tr>
            <th data-nav="name">{{ t('games.header') }}</th>
            <th data-nav="cheats"></th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in store.games.value" :key="game.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'gameDetail', params: {uuid: game.uuid}}">{{ game.name }}</router-link>
            </td>
            <td data-nav="cheats" v-if="game.cheat">
              <router-link :to="{name: 'cheats', params: {game: game.uuid}}">{{ t('cheats.title') }}</router-link>
            </td>
            <td data-nav="cheats" v-else>
              <router-link :to="{name: 'addCheats', params: {game: game.uuid}}">{{ t('cheats.form.add') }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(game.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editGame', params: {uuid: game.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(game.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Games pagination" v-if="store.isPagingAllowed()">
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
      <table id="statistics" class="table" aria-describedby="Statistics for games">
        <thead>
          <tr>
            <th data-nav="count">{{ t('games.statistics.count') }}</th>
            <th data-nav="mediaCount">{{ t('items.mediaCount') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
            <td data-nav="mediaCount">{{ store.statistics.value.mediaCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
