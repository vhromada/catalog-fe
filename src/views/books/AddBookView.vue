<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import BookForm from '../../components/books/BookForm.vue';
import BookMenu from '../../components/books/BookMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Book, ChangeBookRequest } from '../../model/Book.ts';
import { type IResult } from '../../model/common/Result.ts';
import { BookStore } from '../../store/BookStore.ts';

const router = useRouter();
const {t} = useI18n();
const store = new BookStore();
const book = new Book();

async function onSubmit(request: ChangeBookRequest) {
  await store.add(request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'books'});
    }
  });
}

function onCancel() {
  router.push({name: 'books'});
}
</script>

<template>
  <BookMenu/>
  <div class="container-fluid">
    <h2>{{ t('books.form.add') }}</h2>
    <BookForm :book="book" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
