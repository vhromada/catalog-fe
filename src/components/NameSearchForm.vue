<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['search']);
const {t} = useI18n();
const name = ref('');

function onSubmit() {
  emit('search', name.value);
}
</script>

<template>
  <form method="POST" @submit.prevent="onSubmit()">
    <fieldset>
      <div class="row my-2">
        <div class="col-5">
          <label class="form-label" for="name">{{ t('items.name') }}</label>
          <input type="text" id="name" name="name" class="form-control" v-model="name"/>
        </div>
        <div class="col-2 customButton">
          <button type="submit" id="search" name="search" class="btn btn-primary">{{ t('links.search') }}</button>
        </div>
      </div>
    </fieldset>
  </form>
</template>
