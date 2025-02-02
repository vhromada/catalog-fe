<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { BookItem, getBookItemSchema } from '../../../model/BookItem.ts';
import registerStore from '../../../store/RegisterStore.ts';
import ErrorMessage from '../../ErrorMessage.vue';

const props = defineProps({
  book: {type: String, required: true},
  bookItem: {type: BookItem, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getBookItemSchema(),
  initialValues: props.bookItem
});
const onSubmit = handleSubmit((values: any) => {
  const bookItem = new BookItem(values);
  bookItem.normalize();
  emit('submit', bookItem);
});

registerStore.loadLanguages();
registerStore.loadBookItemFormats();

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <label class="mt-2">{{ t('items.language') }}</label>
      <div class="col form-check" v-for="(language, index) in registerStore.languages.value" :key="language" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="checkbox" class="form-check-input" :id="`language${index}`" name="languages" :value="language"/>
        <label class="form-check-label" :for="`language${index}`">{{ t(`registers.${language}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.languages"/>
      <br v-if="errorBag.languages"/>
      <label class="mt-2">{{ t('items.format') }}</label>
      <div class="col form-check" v-for="(format, index) in registerStore.bookItemFormats.value" :key="format" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="radio" :id="`format${index}`" name="format" class="form-check-input" :value="format"/>
        <label class="form-check-label" :for="`format${index}`">{{ t(`registers.${format}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.format"/>
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
