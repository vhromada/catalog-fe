<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BookItemForm from '../../../components/books/items/BookItemForm.vue';
import BookItemMenu from '../../../components/books/items/BookItemMenu.vue';
import ResultError from '../../../components/ResultError.vue';
import { BookItem, IBookItem } from '../../../model/BookItem.ts';
import { IResult, Result } from '../../../model/common/Result.ts';
import { BookItemStore } from '../../../store/BookItemStore.ts';

const props = defineProps({
  book: {type: String, required: true},
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new BookItemStore();
const bookItem = ref({} as BookItem);
const loaded = ref(false);

loadBookItem();

async function loadBookItem() {
  await store.get(props.book, props.uuid).then((result: Result<IBookItem>) => {
    if (result.isOk()) {
      bookItem.value = new BookItem(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(bookItem: BookItem) {
  await store.update(props.book, props.uuid, bookItem).then((result: IResult) => {
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
    <h2>{{ $t('bookItems.form.edit') }}</h2>
    <BookItemForm :book="props.book" :bookItem="bookItem" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
