<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { Author, getAuthorSchema } from '../../model/Author.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  author: {type: Author, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {handleSubmit, errorBag} = useForm({
  validationSchema: getAuthorSchema(),
  initialValues: props.author
});
const onSubmit = handleSubmit((values: any) => {
  const author = new Author(values);
  author.normalize();
  emit('submit', author);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="firstName">{{ $t('authors.items.firstName') }}</label>
        <Field type="text" id="firstName" name="firstName" class="form-control"/>
        <ErrorMessage :errors="errorBag.firstName"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="middleName">{{ $t('authors.items.middleName') }}</label>
        <Field type="text" id="middleName" name="middleName" class="form-control"/>
        <ErrorMessage :errors="errorBag.middleName"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="lastName">{{ $t('authors.items.lastName') }}</label>
        <Field type="text" id="lastName" name="lastName" class="form-control"/>
        <ErrorMessage :errors="errorBag.lastName"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ $t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ $t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ $t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
