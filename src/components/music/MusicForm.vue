<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { getMusicSchema, Music } from '../../model/Music.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  music: {type: Music, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getMusicSchema(),
  initialValues: props.music
});
const onSubmit = handleSubmit((values: any) => {
  const music = new Music(values);
  music.normalize();
  emit('submit', music);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="name">{{ t('items.name') }}</label>
        <Field type="text" id="name" name="name" class="form-control"/>
        <ErrorMessage :errors="errorBag.name"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="wikiCz">{{ t('items.wikiCz') }}</label>
        <Field type="text" id="wikiCz" name="wikiCz" class="form-control"/>
        <ErrorMessage :errors="errorBag.wikiCz"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="wikiEn">{{ t('items.wikiEn') }}</label>
        <Field type="text" id="wikiEn" name="wikiEn" class="form-control"/>
        <ErrorMessage :errors="errorBag.wikiEn"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="mediaCount">{{ t('items.mediaCount') }}</label>
        <Field type="number" id="mediaCount" name="mediaCount" class="form-control" min="1" max="100" step="1"/>
        <ErrorMessage :errors="errorBag.mediaCount"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="note">{{ t('items.note') }}</label>
        <Field type="text" id="note" name="note" class="form-control"/>
        <ErrorMessage :errors="errorBag.note"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
