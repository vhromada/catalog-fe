<script setup lang="ts">
import { Field, FieldArray, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Time } from '../../model/common/Time.ts';
import { modalOpen } from '../../model/common/View.ts';
import { ChangeMovieRequest, getMovieSchema, Movie } from '../../model/Movie.ts';
import { GenreStore } from '../../store/GenreStore.ts';
import registerStore from '../../store/RegisterStore.ts';
import config from '../../utils/Config.ts';
import { emitter } from '../../utils/Event.ts';
import ErrorMessage from '../ErrorMessage.vue';
import PictureModal from '../pictures/PictureModal.vue';
import TimeComponent from '../TimeComponent.vue';

const props = defineProps({
  movie: {type: Movie, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const genreStore = new GenreStore();
const picture = ref(props.movie.picture);
const currentYear = new Date().getFullYear();
const {handleSubmit, setFieldValue, errorBag} = useForm({
  validationSchema: getMovieSchema(),
  initialValues: props.movie
});
const onSubmit = handleSubmit((values) => {
  const request = new ChangeMovieRequest(values);
  emit('submit', request);
});

genreStore.getAll();
registerStore.loadLanguages();
registerStore.loadSubtitles();

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
        <label class="form-label" for="year">{{ t('movies.items.year') }}</label>
        <Field type="number" id="year" name="year" class="form-control" min="1930" :max="currentYear" step="1"/>
        <ErrorMessage :errors="errorBag.year"/>
      </div>
      <label class="mt-2">{{ t('items.language') }}</label>
      <div class="col form-check" v-for="(language, index) in registerStore.languages.value" :key="language" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="checkbox" class="form-check-input" :id="`languages${index}`" name="languages" :value="language"/>
        <label class="form-check-label" :for="`index${index}`">{{ t(`registers.${language}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.languages"/>
      <br v-if="errorBag.languages">
      <label class="mt-2">{{ t('items.subtitles') }}</label>
      <div class="col form-check" v-for="(subtitlesItem, index) in registerStore.subtitles.value" :key="subtitlesItem" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="checkbox" class="form-check-input" :id="`subtitles${index}`" name="subtitles" :value="subtitlesItem"/>
        <label class="form-check-label" :for="`subtitles${index}`">{{ t(`registers.${subtitlesItem}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.subtitles"/>
      <label class="form-label">{{ t('movies.items.media') }}</label>
      <FieldArray name="media" v-slot="{fields, push, remove}">
        <div v-for="(entry, index) in fields" :key="entry.key">
          <div class="col">
            <label>{{ t('movies.form.medium', {'index': index + 1}) }}</label>
            <button type="button" class="btn btn-danger" :id="`removeMedium${index}`" :name="`removeMedium${index}`" v-if="index > 0" @click="remove(index)">
              {{ t('links.remove') }}
            </button>
          </div>
          <TimeComponent :path="`media[${index}]`" :prefix="`medium${index + 1}`" :errorBag="errorBag"/>
        </div>
        <div class="col my-2">
          <button type="button" id="addMedium" name="addMedium" class="btn btn-success" @click="push(new Time())">{{ t('links.add') }}</button>
        </div>
      </FieldArray>
      <ErrorMessage :errors="errorBag.media"/>
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
        <img alt="Movie" class="picture" :src="`${config.catalogUrl}public/pictures/${picture}`" v-if="picture"/>
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
        <Field id="genres" name="genres" :multiple="true" class="form-control" v-if="genreStore.exists()" as="select" v-slot="{value}">
          <option v-for="genre in genreStore.genres.value" :key="genre.uuid" :value="genre.uuid" :selected="value && value.includes(genre.uuid)">{{ genre.name }}</option>
        </Field>
        <ErrorMessage :errors="errorBag.genres"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
      <PictureModal @choose="onChoosePicture"></PictureModal>
    </fieldset>
  </form>
</template>
