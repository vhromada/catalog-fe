<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const picture = ref({} as File);
const error = ref('');

function onFileChanged(event: any) {
  const file = event.target.files[0] as File;
  if (file.size > 5242880) {
    picture.value = {} as File
    error.value = t('pictures.errors.maxSize');
  } else {
    picture.value = file;
    error.value = ''
  }
}

function onSubmit() {
  if (!(picture.value instanceof File)) {
    error.value = t('pictures.errors.required');
  } else {
    emit('submit', picture.value);
  }
}

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit.prevent="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="file">{{ t('pictures.form.content') }}</label>
        <input type="file" id="file" name="file" class="form-control" @change="onFileChanged($event)"/>
      </div>
      <span class="error" v-if="error">{{ error }}</span>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary">{{ t('links.create') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
