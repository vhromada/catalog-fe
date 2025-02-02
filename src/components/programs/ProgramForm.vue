<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { getProgramSchema, Program } from '../../model/Program.ts';
import registerStore from '../../store/RegisterStore.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  program: {type: Program, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getProgramSchema(),
  initialValues: props.program
});
const onSubmit = handleSubmit((values: any) => {
  const program = new Program(values);
  program.normalize();
  emit('submit', program);
});

registerStore.loadProgramFormats();

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
      <label class="mt-2">{{ t('items.format') }}</label>
      <div class="col form-check" v-for="(format, index) in registerStore.programFormats.value" :key="format" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="radio" :id="`format${index}`" name="format" class="form-check-input" :value="format"/>
        <label class="form-check-label" :for="`format${index}`">{{ t(`registers.${format}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.format"/>
      <div class="col mt-4 mb-2 form-check">
        <Field type="checkbox" id="crack" name="crack" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="crack">{{ t('items.crack') }}</label>
        <ErrorMessage :errors="errorBag.crack"/>
      </div>
      <div class="col my-2 form-check">
        <Field type="checkbox" id="serialKey" name="serialKey" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="serialKey">{{ t('items.serialKey') }}</label>
        <ErrorMessage :errors="errorBag.serialKey"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="otherData">{{ t('items.otherData') }}</label>
        <Field type="text" id="otherData" name="otherData" class="form-control"/>
        <ErrorMessage :errors="errorBag.otherData"/>
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
