<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AuthorForm from '../../components/authors/AuthorForm.vue';
import AuthorMenu from '../../components/authors/AuthorMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Author, type IAuthor } from '../../model/Author.ts';
import { type IResult, Result } from '../../model/common/Result.ts';
import { AuthorStore } from '../../store/AuthorStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new AuthorStore();
const author = ref({} as Author);
const loaded = ref(false);

loadAuthor();

async function loadAuthor() {
  await store.get(props.uuid).then((result: Result<IAuthor>) => {
    if (result.isOk()) {
      author.value = new Author(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(author: Author) {
  await store.update(props.uuid, author).then((result: IResult) => {
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
    <h2>{{ t('authors.form.edit') }}</h2>
    <AuthorForm :author="author" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
