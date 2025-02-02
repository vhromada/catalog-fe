<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { ChangeRoles, getRoleSchema } from '../../model/Account.ts';
import registerStore from '../../store/RegisterStore.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  role: {type: ChangeRoles, required: true},
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getRoleSchema(),
  initialValues: props.role
});
const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});

registerStore.loadRoles();

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col form-check" v-for="(role, index) in registerStore.roles.value" :key="role" :class="{'mb-2':index == 0, 'my-2':index > 0}">
        <Field type="checkbox" class="form-check-input" :id="`role${index}`" name="roles" :value="role"/>
        <label class="form-check-label" :for="`role${index}`">{{ t(`registers.${role}`) }}</label>
      </div>
      <ErrorMessage :errors="errorBag.roles"/>
      <div class="col mt-4">
        <button type="submit" id="update" name="update" class="btn btn-primary">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
