<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BookMenu from '../../components/books/BookMenu.vue';
import MultipleNameSearchForm from '../../components/MultipleNameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { BookStore } from '../../store/BookStore.ts';

const {t} = useI18n();
const store = new BookStore();

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
  <BookMenu/>
  <div class="container-fluid">
    <h2>{{ t('books.title') }}</h2>
    <MultipleNameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="books" class="table table-hover" aria-describedby="List of books">
        <thead>
          <tr>
            <th data-nav="name">{{ t('books.header') }}</th>
            <th data-nav="bookItems"></th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in store.books.value" :key="book.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'bookDetail', params: {uuid: book.uuid}}">{{ book.czechName }}</router-link>
            </td>
            <td data-nav="bookItems">
              <router-link :to="{name: 'bookItems', params: {book: book.uuid}}">{{ t('bookItems.title') }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(book.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editBook', params: {uuid: book.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(book.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Books pagination" v-if="store.isPagingAllowed()">
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
      <table id="statistics" class="table" aria-describedby="Statistics for books">
        <thead>
          <tr>
            <th data-nav="count">{{ t('books.statistics.count') }}</th>
            <th data-nav="bookItemsCount">{{ t('books.statistics.bookItems') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
            <td data-nav="bookItemsCount">{{ store.statistics.value.itemsCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
