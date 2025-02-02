<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { modalOpen } from '../../model/common/View.ts';
import { ChangeShowRequest, getShowSchema, Show } from '../../model/Show.ts';
import { GenreStore } from '../../store/GenreStore.ts';
import config from '../../utils/Config.ts';
import { emitter } from '../../utils/Event.ts';
import ErrorMessage from '../ErrorMessage.vue';
import PictureModal from '../pictures/PictureModal.vue';

const props = defineProps({
  show: {type: Show, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const store = new GenreStore();
const picture = ref(props.show.picture);
const {handleSubmit, setFieldValue, errorBag} = useForm({
  validationSchema: getShowSchema(),
  initialValues: props.show
});
const onSubmit = handleSubmit(async (values) => {
  const request = new ChangeShowRequest(values);
  emit('submit', request);
});

store.getAll();

function onAddPicture() {
  emitter.emit('picture', modalOpen(picture.value));
}

function onRemovePicture() {
  setFieldValue('picture', undefined);
  picture.value = undefined;
}

function onChoosePicture(pictureValue: string) {
  setFieldValue('picture', pictureValue);
  picture.value = pictureValue;
}

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
        <label class="form-label" for="csfd">{{ t('items.csfd') }}</label>
        <Field type="text" id="csfd" name="csfd" class="form-control"/>
        <ErrorMessage :errors="errorBag.csfd"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="imdbCode">{{ t('items.imdb') }}</label>
        <Field type="number" id="imdbCode" name="imdbCode" class="form-control" min="1" max="999999999" step="1"/>
        <ErrorMessage :errors="errorBag.imdbCode"/>
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
        <label class="form-label">{{ t('items.picture') }}</label>
        <img alt="Show" class="picture" :src="`${config.catalogUrl}public/pictures/${picture}`" v-if="picture"/>
        <button type="button" id="removePicture" name="removePicture" class="btn btn-danger" @click.prevent="onRemovePicture" v-if="picture">{{ t('links.remove') }}</button>
        <button type="button" id="choosePicture" class="btn btn-success" data-bs-toggle="modal" @click.prevent="onAddPicture">{{ t('links.choosePicture') }}</button>
      </div>
      <div class="col my-2">
        <label class="form-label" for="note">{{ t('items.note') }}</label>
        <Field type="text" id="note" name="note" class="form-control"/>
        <ErrorMessage :errors="errorBag.note"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="genres">{{ t('genres.title') }}</label>
        <Field id="genres" name="genres" :multiple="true" class="form-control" v-if="store.exists()" as="select" v-slot="{value}">
          <option v-for="genre in store.genres.value" :key="genre.uuid" :value="genre.uuid" :selected="value && value.includes(genre.uuid)">{{ genre.name }}</option>
        </Field>
        <ErrorMessage :errors="errorBag.genres"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
      <PictureModal @choose="onChoosePicture"/>
    </fieldset>
  </form>
</template>
