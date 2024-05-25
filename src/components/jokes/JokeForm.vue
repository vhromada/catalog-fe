<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { getJokeSchema, Joke } from '../../model/Joke.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  joke: {type: Joke, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {handleSubmit, errorBag} = useForm({
  validationSchema: getJokeSchema(),
  initialValues: props.joke
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
        <label class="form-label" for="content">{{ $t('jokes.items.content') }}</label>
        <Field as="textarea" id="content" name="content" class="form-control"/>
        <ErrorMessage :errors="errorBag.content"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ $t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ $t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ $t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
