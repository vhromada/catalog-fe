<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { ChangeEpisodeRequest, Episode, getEpisodeSchema } from '../../model/Episode.ts';
import ErrorMessage from '../ErrorMessage.vue';
import TimeComponent from '../TimeComponent.vue';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: String, required: true},
  episode: {type: Episode, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {handleSubmit, errorBag} = useForm({
  validationSchema: getEpisodeSchema(),
  initialValues: props.episode
});
const onSubmit = handleSubmit((values: any) => {
  const request = new ChangeEpisodeRequest(values);
  emit('submit', request);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="number">{{ $t('items.number') }}</label>
        <Field type="number" id="number" name="number" class="form-control" min="1" max="500" step="1"/>
        <ErrorMessage :errors="errorBag.number"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="name">{{ $t('items.name') }}</label>
        <Field type="text" id="name" name="name" class="form-control"/>
        <ErrorMessage :errors="errorBag.name"/>
      </div>
      <label class="form-label">{{ $t('items.length') }}</label>
      <TimeComponent path="length" :errorBag="errorBag"/>
      <div class="col my-2">
        <label class="form-label" for="note">{{ $t('items.note') }}</label>
        <Field type="text" id="note" name="note" class="form-control"/>
        <ErrorMessage :errors="errorBag.note"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ $t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ $t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ $t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
