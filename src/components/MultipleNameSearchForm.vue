<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['search']);
const czechName = ref('');
const originalName = ref('');

function onSubmit() {
  emit('search', czechName.value, originalName.value);
}
</script>

<template>
  <form method="POST" @submit.prevent="onSubmit()">
    <fieldset>
      <div class="row my-2">
        <div class="col-5">
          <label class="form-label" for="czechName">{{ $t('items.czechName') }}</label>
          <input type="text" id="czechName" name="czechName" class="form-control" v-model="czechName"/>
        </div>
        <div class="col-5">
          <label class="form-label" for="originalName">{{ $t('items.originalName') }}</label>
          <input type="text" id="originalName" name="originalName" class="form-control" v-model="originalName"/>
        </div>
        <div class="col-2 customButton">
          <button type="submit" id="search" name="search" class="btn btn-primary">{{ $t('links.search') }}</button>
        </div>
      </div>
    </fieldset>
  </form>
</template>
