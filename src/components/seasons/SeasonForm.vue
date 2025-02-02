<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { getSeasonSchema, Season } from '../../model/Season.ts';
import registerStore from '../../store/RegisterStore.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  show: {type: String, required: true},
  season: {type: Season, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const currentYear = new Date().getFullYear();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getSeasonSchema(),
  initialValues: props.season
});
const onSubmit = handleSubmit((values: any) => {
  const season = new Season(values);
  season.normalize();
  emit('submit', season);
});

registerStore.loadLanguages();
registerStore.loadSubtitles();

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="number">{{ t('items.number') }}</label>
        <Field type="number" id="number" name="number" class="form-control" min="1" max="500" step="1"/>
        <ErrorMessage :errors="errorBag.number"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="startYear">{{ t('seasons.items.startYear') }}</label>
        <Field type="number" id="startYear" name="startYear" class="form-control" min="1930" :max="currentYear" step="1"/>
        <ErrorMessage :errors="errorBag.startYear"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="endYear">{{ t('seasons.items.endYear') }}</label>
        <Field type="number" id="endYear" name="endYear" class="form-control" min="1930" :max="currentYear" step="1"/>
        <ErrorMessage :errors="errorBag.endYear"/>
      </div>
      <label class="mt-2">{{ t('items.language') }}</label>
      <div class="col form-check" v-for="(language, index) in registerStore.languages.value" :key="language" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="radio" class="form-check-input" :id="`language${index}`" name="language" :value="language"/>
        <label class="form-check-label" :for="`index${index}`">{{ t(`registers.${language}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.language"/>
      <br v-if="errorBag.language"/>
      <label class="mt-2">{{ t('items.subtitles') }}</label>
      <div class="col form-check" v-for="(subtitlesItem, index) in registerStore.subtitles.value" :key="subtitlesItem" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="checkbox" class="form-check-input" :id="`subtitles${index}`" name="subtitles" :value="subtitlesItem"/>
        <label class="form-check-label" :for="`subtitles${index}`">{{ t(`registers.${subtitlesItem}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.subtitles"/>
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
