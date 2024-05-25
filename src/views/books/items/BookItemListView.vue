<script setup lang="ts">
import BookItemMenu from '../../../components/books/items/BookItemMenu.vue';
import ResultError from '../../../components/ResultError.vue';
import { BookItemStore } from '../../../store/BookItemStore.ts';

const props = defineProps({
  book: {type: String, required: true}
});
const store = new BookItemStore();

store.load(props.book);

async function duplicate(uuid: string) {
  await store.duplicate(props.book, uuid);
}

async function remove(uuid: string) {
  await store.remove(props.book, uuid);
}

async function first() {
  await store.first(props.book);
}

async function previous() {
  await store.previous(props.book);
}

async function next() {
  await store.next(props.book);
}

async function last() {
  await store.last(props.book);
}
</script>

<template>
  <BookItemMenu :book="props.book"/>
  <div class="container-fluid">
    <h2>{{ $t('bookItems.title') }}</h2>
    <div class="table-responsive" v-if="store.exists()">
      <table id="bookItems" class="table table-hover" aria-describedby="List of book items">
        <thead>
          <tr>
            <th data-nav="name">{{ $t('bookItems.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bookItem in store.bookItems.value" :key="bookItem.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'bookItemDetail', params: {book: props.book, uuid: bookItem.uuid}}">{{ $t(`registers.${bookItem.format}`) }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(bookItem.uuid)">{{ $t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editBookItem', params: {book: props.book, uuid: bookItem.uuid}}">{{ $t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(bookItem.uuid)">{{ $t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Book items pagination" v-if="store.isPagingAllowed()">
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
    <span id="noData" v-if="!store.exists">{{ $t('bookItems.noData') }}</span>
  </div>
  <ResultError/>
</template>
