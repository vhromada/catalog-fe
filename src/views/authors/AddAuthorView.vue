<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AuthorForm from '../../components/authors/AuthorForm.vue';
import AuthorMenu from '../../components/authors/AuthorMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Author } from '../../model/Author.ts';
import { type IResult } from '../../model/common/Result.ts';
import { AuthorStore } from '../../store/AuthorStore.ts';

const router = useRouter();
const {t} = useI18n();
const store = new AuthorStore();
const author = new Author();

async function onSubmit(author: Author) {
  await store.add(author).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'authors'});
    }
  });
}

function onCancel() {
  router.push({name: 'authors'});
}
</script>

<template>
  <AuthorMenu/>
  <div class="container-fluid">
    <h2>{{ t('authors.form.add') }}</h2>
    <AuthorForm :author="author" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
