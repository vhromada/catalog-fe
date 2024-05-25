<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { Genre, getGenreSchema } from '../../model/Genre.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  genre: {type: Genre, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {handleSubmit, errorBag} = useForm({
  validationSchema: getGenreSchema(),
  initialValues: props.genre
});
const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="name">{{ $t('items.name') }}</label>
        <Field type="text" id="name" name="name" class="form-control"/>
        <ErrorMessage :errors="errorBag.name"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ $t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ $t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ $t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
