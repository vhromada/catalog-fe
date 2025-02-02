<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JokeMenu from '../../components/jokes/JokeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IJoke } from '../../model/Joke.ts';
import { JokeStore } from '../../store/JokeStore.ts';

const {t} = useI18n();
const store = new JokeStore();

store.load();

async function remove(uuid: string) {
  await store.remove(uuid);
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

function formatContent(joke: IJoke): string {
  return joke.content
      .replace(/\n/g, ' ')
      .slice(0, 100);
}
</script>

<template>
  <JokeMenu/>
  <div class="container-fluid">
    <h2>{{ t('jokes.title') }}</h2>
    <div class="table-responsive" v-if="store.exists()">
      <table id="jokes" class="table table-hover" aria-describedby="List of jokes">
        <thead>
          <tr>
            <th data-nav="name">{{ t('jokes.header') }}</th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="joke in store.jokes.value" :key="joke.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'jokeDetail', params: {uuid: joke.uuid}}">{{ formatContent(joke) }}</router-link>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editJoke', params: {uuid: joke.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(joke.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Jokes pagination" v-if="store.isPagingAllowed()">
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
      <table id="statistics" class="table" aria-describedby="Statistics for jokes">
        <thead>
          <tr>
            <th data-nav="count">{{ t('jokes.statistics.count') }}</th>
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
