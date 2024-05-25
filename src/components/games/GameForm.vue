<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { Game, getGameSchema } from '../../model/Game.ts';
import registerStore from '../../store/RegisterStore.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  game: {type: Game, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {handleSubmit, errorBag} = useForm({
  validationSchema: getGameSchema(),
  initialValues: props.game
});
const onSubmit = handleSubmit((values: any) => {
  const game = new Game(values);
  game.normalize();
  emit('submit', game);
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
        <label class="form-label" for="name">{{ $t('items.name') }}</label>
        <Field type="text" id="name" name="name" class="form-control"/>
        <ErrorMessage :errors="errorBag.name"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="wikiCz">{{ $t('items.wikiCz') }}</label>
        <Field type="text" id="wikiCz" name="wikiCz" class="form-control"/>
        <ErrorMessage :errors="errorBag.wikiCz"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="wikiEn">{{ $t('items.wikiEn') }}</label>
        <Field type="text" id="wikiEn" name="wikiEn" class="form-control"/>
        <ErrorMessage :errors="errorBag.wikiEn"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="mediaCount">{{ $t('items.mediaCount') }}</label>
        <Field type="number" id="mediaCount" name="mediaCount" class="form-control" min="1" max="100" step="1"/>
        <ErrorMessage :errors="errorBag.mediaCount"/>
      </div>
      <label class="mt-2">{{ $t('items.format') }}</label>
      <div class="col form-check" v-for="(format, index) in registerStore.programFormats.value" :key="format" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="radio" :id="`format${index}`" name="format" class="form-check-input" :value="format"/>
        <label class="form-check-label" :for="`format${index}`">{{ $t(`registers.${format}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.format"/>
      <div class="col mt-4 mb-2 form-check">
        <Field type="checkbox" id="crack" name="crack" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="crack">{{ $t('items.crack') }}</label>
        <ErrorMessage :errors="errorBag.crack"/>
      </div>
      <div class="col mb-2 form-check">
        <Field type="checkbox" id="serialKey" name="serialKey" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="serialKey">{{ $t('items.serialKey') }}</label>
        <ErrorMessage :errors="errorBag.serialKey"/>
      </div>
      <div class="col mb-2 form-check">
        <Field type="checkbox" id="patch" name="patch" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="patch">{{ $t('games.items.patch') }}</label>
        <ErrorMessage :errors="errorBag.patch"/>
      </div>
      <div class="col mb-2 form-check">
        <Field type="checkbox" id="trainer" name="trainer" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="trainer">{{ $t('games.items.trainer') }}</label>
        <ErrorMessage :errors="errorBag.trainer"/>
      </div>
      <div class="col mb-2 form-check">
        <Field type="checkbox" id="trainerData" name="trainerData" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="trainerData">{{ $t('games.items.trainerData') }}</label>
        <ErrorMessage :errors="errorBag.trainerData"/>
      </div>
      <div class="col mb-2 form-check">
        <Field type="checkbox" id="editor" name="editor" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="editor">{{ $t('games.items.editor') }}</label>
        <ErrorMessage :errors="errorBag.editor"/>
      </div>
      <div class="col mb-2 form-check">
        <Field type="checkbox" id="saves" name="saves" class="form-check-input" :value="true" :unchecked-value="false"/>
        <label class="form-check-label" for="saves">{{ $t('games.items.saves') }}</label>
        <ErrorMessage :errors="errorBag.saves"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="otherData">{{ $t('items.otherData') }}</label>
        <Field type="text" id="otherData" name="otherData" class="form-control"/>
        <ErrorMessage :errors="errorBag.otherData"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="note">{{ $t('items.note') }}</label>
        <Field type="text" id="note" name="note" class="form-control"/>
        <ErrorMessage :errors="errorBag.note"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ $t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ $t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ $t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
