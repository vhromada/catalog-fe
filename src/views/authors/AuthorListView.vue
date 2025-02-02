<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthorMenu from '../../components/authors/AuthorMenu.vue';
import AuthorSearchForm from '../../components/authors/AuthorSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { formatAuthor } from '../../formatters';
import { AuthorStore } from '../../store/AuthorStore.ts';

const {t} = useI18n();
const store = new AuthorStore();

store.load();

async function duplicate(uuid: string) {
  await store.duplicate(uuid);
}

async function remove(uuid: string) {
  await store.remove(uuid);
}

async function search(firstName: string, middleName: string, lastName: string) {
  await store.search(firstName, middleName, lastName);
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
  <AuthorMenu/>
  <div class="container-fluid">
    <h2>{{ t('authors.title') }}</h2>
    <AuthorSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="authors" class="table table-hover" aria-describedby="List of authors">
        <thead>
          <tr>
            <th data-nav="name">{{ t('authors.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in store.authors.value" :key="author.uuid">
            <td data-nav="name">{{ formatAuthor(author) }}</td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(author.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editAuthor', params: {uuid: author.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(author.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Authors pagination" v-if="store.isPagingAllowed()">
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
      <table id="statistics" class="table" aria-describedby="Statistics for authors">
        <thead>
          <tr>
            <th data-nav="count">{{ t('authors.statistics.count') }}</th>
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
