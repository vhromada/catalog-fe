<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { getHandbookSchema, Handbook } from '../../model/Handbook.ts';
import RichTextEditor from '../RichTextEditor.vue';

const props = defineProps({
  game: {type: String, required: true},
  handbook: {type: Handbook, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit} = useForm({
  validationSchema: getHandbookSchema(),
  initialValues: props.handbook
});
const onSubmit = handleSubmit((values: Handbook) => {
  emit('submit', values);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <RichTextEditor name="content" :label="t('handbooks.items.content')"/>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
