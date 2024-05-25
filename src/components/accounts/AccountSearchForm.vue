<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['search']);
const username = ref('');

function onSubmit() {
  emit('search', username.value);
}
</script>

<template>
  <form method="POST" @submit.prevent="onSubmit()">
    <fieldset>
      <div class="row my-2">
        <div class="col-5">
          <label class="form-label" for="username">{{ $t('accounts.items.username') }}</label>
          <input type="text" id="username" name="username" class="form-control" v-model="username"/>
        </div>
        <div class="col-2 customButton">
          <button type="submit" id="search" name="search" class="btn btn-primary">{{ $t('links.search') }}</button>
        </div>
      </div>
    </fieldset>
  </form>
</template>
