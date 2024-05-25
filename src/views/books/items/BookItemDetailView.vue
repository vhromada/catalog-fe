<script setup lang="ts">
import { ref } from 'vue';
import BookItemMenu from '../../../components/books/items/BookItemMenu.vue';
import ResultError from '../../../components/ResultError.vue';
import { IBookItem } from '../../../model/BookItem.ts';
import { Result } from '../../../model/common/Result.ts';
import { BookItemStore } from '../../../store/BookItemStore.ts';

const props = defineProps({
  book: {type: String, required: true},
  uuid: {type: String, required: true}
});
const store = new BookItemStore();
const bookItem = ref({} as IBookItem);
const loaded = ref(false);

loadBookItem();

async function loadBookItem() {
  await store.get(props.book, props.uuid).then((result: Result<IBookItem>) => {
    if (result.isOk()) {
      bookItem.value = result.data!!;
      loaded.value = true;
    }
  });
}
</script>

<template>
  <BookItemMenu :book="props.book"/>
  <div class="container-fluid">
    <h2>{{ $t('bookItems.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Book item detail">
        <tbody>
          <tr v-if="bookItem.languages && bookItem.languages.length > 0">
            <td class="title">{{ $t('items.languages') }}</td>
            <td>{{ bookItem.languages.map(language => $t(`registers.${language}`)).join(', ') }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('items.format') }}</td>
            <td>{{ $t(`registers.${bookItem.format}`) }}</td>
          </tr>
          <tr v-if="bookItem.note">
            <td class="title">{{ $t('items.note') }}</td>
            <td>{{ bookItem.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
