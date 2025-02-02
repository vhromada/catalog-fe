<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { formatAuthor } from '../../formatters';
import { Book, ChangeBookRequest, getBookSchema } from '../../model/Book.ts';
import { AuthorStore } from '../../store/AuthorStore.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  book: {type: Book, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const store = new AuthorStore();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getBookSchema(),
  initialValues: props.book
});
const onSubmit = handleSubmit((values: number) => {
  const request = new ChangeBookRequest(values);
  emit('submit', request);
});

store.getAll();

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="czechName">{{ t('items.czechName') }}</label>
        <Field type="text" id="czechName" name="czechName" class="form-control"/>
        <ErrorMessage :errors="errorBag.czechName"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="originalName">{{ t('items.originalName') }}</label>
        <Field type="text" id="originalName" name="originalName" class="form-control"/>
        <ErrorMessage :errors="errorBag.originalName"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="description">{{ t('items.description') }}</label>
        <Field type="text" id="description" name="description" class="form-control"/>
        <ErrorMessage :errors="errorBag.description"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="note">{{ t('items.note') }}</label>
        <Field type="text" id="note" name="note" class="form-control"/>
        <ErrorMessage :errors="errorBag.note"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="authors">{{ t('authors.title') }}</label>
        <Field id="authors" name="authors" :multiple="true" class="form-control" v-if="store.exists()" as="select" v-slot="{value}">
          <option v-for="author in store.authors.value" :key="author.uuid" :value="author.uuid" :selected="value && value.includes(author.uuid)">{{ formatAuthor(author) }}</option>
        </Field>
        <ErrorMessage :errors="errorBag.authors"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
