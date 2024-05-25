<script setup lang="ts">
import { useRouter } from 'vue-router';
import BookItemForm from '../../../components/books/items/BookItemForm.vue';
import BookItemMenu from '../../../components/books/items/BookItemMenu.vue';
import ResultError from '../../../components/ResultError.vue';
import { BookItem } from '../../../model/BookItem.ts';
import { IResult } from '../../../model/common/Result.ts';
import { BookItemStore } from '../../../store/BookItemStore.ts';
import { BookStore } from '../../../store/BookStore.ts';

const props = defineProps({
  book: {type: String, required: true}
});
const router = useRouter();
const bookStore = new BookStore();
const itemStore = new BookItemStore();
const bookItem = new BookItem();

bookStore.get(props.book);

async function onSubmit(bookItem: BookItem) {
  await itemStore.add(props.book, bookItem).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'bookItems'});
    }
  });
}

function onCancel() {
  router.push({name: 'bookItems'});
}
</script>

<template>
  <BookItemMenu :book="props.book"/>
  <div class="container-fluid">
    <h2>{{ $t('bookItems.form.add') }}</h2>
    <BookItemForm :book="props.book" :bookItem="bookItem" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
