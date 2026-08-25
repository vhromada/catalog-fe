<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const picture = ref({} as File);
const isTooLarge = ref(false);
const error = ref('');

function onFileChanged(event: Event) {
  const file = (event.target as HTMLInputElement).files![0];
  if (file.size > 5242880) {
    isTooLarge.value = true;
    error.value = t('pictures.errors.maxSize');
  } else {
    isTooLarge.value = false;
    picture.value = file;
    error.value = '';
  }
}

function onSubmit() {
  if (isTooLarge.value) {
    return;
  }
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
