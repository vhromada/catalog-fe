<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { getWalkthroughSchema, Walkthrough } from '../../model/Walkthrough.ts';
import RichTextEditor from '../RichTextEditor.vue';

const props = defineProps({
  game: {type: String, required: true},
  walkthrough: {type: Walkthrough, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit} = useForm({
  validationSchema: getWalkthroughSchema(),
  initialValues: props.walkthrough
});
const onSubmit = handleSubmit((values: Walkthrough) => {
  emit('submit', values);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <RichTextEditor name="content" :label="t('walkthroughs.items.content')"/>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
