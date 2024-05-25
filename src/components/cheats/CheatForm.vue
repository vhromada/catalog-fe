<script setup lang="ts">
import { Field, FieldArray, useForm } from 'vee-validate';
import { ChangeCheatRequest, Cheat, CheatData, getCheatSchema } from '../../model/Cheat.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  game: {type: String, required: true},
  cheat: {type: Cheat, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {handleSubmit, errorBag} = useForm({
  validationSchema: getCheatSchema(),
  initialValues: props.cheat
});
const onSubmit = handleSubmit((values: any) => {
  const request = new ChangeCheatRequest(values);
  emit('submit', request);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="gameSetting">{{ $t('cheats.items.gameSetting') }}</label>
        <Field type="text" id="gameSetting" name="gameSetting" class="form-control"/>
        <ErrorMessage :errors="errorBag.gameSetting"/>
      </div>
      <div class="col my-2">
        <label class="form-label" for="cheatSetting">{{ $t('cheats.items.cheatSetting') }}</label>
        <Field type="text" id="cheatSetting" name="cheatSetting" class="form-control"/>
        <ErrorMessage :errors="errorBag.cheatSetting"/>
      </div>
      <label class="my-2">{{ $t('cheats.title') }}</label>
      <FieldArray name="data" v-slot="{fields, push, remove}">
        <div v-for="(entry, index) in fields" :key="entry.key">
          <div class="col">
            <label>{{ $t('cheats.form.cheat', {'index': index + 1}) }}</label>
            <button type="button" class="btn btn-danger" :id="`removeCheat${index}`" :name="`removeCheat${index}`" v-if="index > 0" @click="remove(index)">
              {{ $t('links.remove') }}
            </button>
          </div>
          <div class="col my-2">
            <label class="form-label" :for="`cheat${index}Action`">{{ $t('cheats.form.action', {'index': index + 1}) }}</label>
            <Field type="text" class="form-control" :id="`cheat${index}Action`" :name="`data[${index}].action`"/>
            <ErrorMessage :errors="(errorBag as any)[`data[${index}].action`]"/>
          </div>
          <div class="col my-2">
            <label class="form-label" :for="`cheat${index}Description`">{{ $t('cheats.form.description', {'index': index + 1}) }}</label>
            <Field type="text" class="form-control" :id="`cheat${index}Description`" :name="`data[${index}].description`"/>
            <ErrorMessage :errors="(errorBag as any)[`data[${index}].description`]"/>
          </div>
        </div>
        <div class="col my-2">
          <button type="button" id="addCheat" name="addCheat" class="btn btn-success" @click="push(new CheatData())">{{ $t('links.add') }}</button>
        </div>
      </FieldArray>
      <ErrorMessage :errors="errorBag.data"/>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ $t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ $t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ $t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
