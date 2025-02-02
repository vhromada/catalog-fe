<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BookMenu from '../../components/books/BookMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { formatAuthor } from '../../formatters';
import { type IBook } from '../../model/Book.ts';
import { Result } from '../../model/common/Result.ts';
import { BookStore } from '../../store/BookStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const {t} = useI18n();
const store = new BookStore();
const book = ref({} as IBook);
const loaded = ref(false);

loadBook();

async function loadBook() {
  await store.get(props.uuid).then((result: Result<IBook>) => {
    if (result.isOk()) {
      book.value = result.data!;
      loaded.value = true;
    }
  });
}

function formatAuthors(): string {
  const result: string[] = [];
  book.value.authors.forEach((author) => result.push(formatAuthor(author)));
  return result.join(', ');
}
</script>

<template>
  <BookMenu/>
  <div class="container-fluid">
    <h2>{{ t('books.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Book detail">
        <tbody>
          <tr>
            <td class="title">{{ t('items.czechName') }}</td>
            <td>{{ book.czechName }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.originalName') }}</td>
            <td>{{ book.originalName }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('authors.title') }}</td>
            <td>{{ formatAuthors() }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.description') }}</td>
            <td>{{ book.description }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('books.statistics.bookItems') }}</td>
            <td>{{ book.itemsCount }}</td>
          </tr>
          <tr v-if="book.note">
            <td class="title">{{ t('items.note') }}</td>
            <td>{{ book.note }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <router-link :to="{name: 'bookItems', params: {book: book.uuid}}">{{ t('bookItems.title') }}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
