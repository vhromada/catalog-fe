<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BookForm from '../../components/books/BookForm.vue';
import BookMenu from '../../components/books/BookMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Book, ChangeBookRequest, IBook } from '../../model/Book.ts';
import { IResult, Result } from '../../model/common/Result.ts';
import { BookStore } from '../../store/BookStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new BookStore();
const book = ref({} as Book);
const loaded = ref(false);

loadBook();

async function loadBook() {
  await store.get(props.uuid).then((result: Result<IBook>) => {
    if (result.isOk()) {
      book.value = new Book(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(request: ChangeBookRequest) {
  await store.update(props.uuid, request).then((result: IResult) => {
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
    <h2>{{ $t('books.form.edit') }}</h2>
    <BookForm :book="book" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
