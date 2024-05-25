<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['search']);
const firstName = ref('');
const middleName = ref('');
const lastName = ref('');

function onSubmit() {
  emit('search', firstName.value, middleName.value, lastName.value);
}
</script>

<template>
  <form method="POST" @submit.prevent="onSubmit()">
    <fieldset>
      <div class="row my-2">
        <div class="col-3">
          <label class="form-label" for="firstName">{{ $t('authors.items.firstName') }}</label>
          <input type="text" id="firstName" name="firstName" class="form-control" v-model="firstName"/>
        </div>
        <div class="col-3">
          <label class="form-label" for="middleName">{{ $t('authors.items.middleName') }}</label>
          <input type="text" id="middleName" name="middleName" class="form-control" v-model="middleName"/>
        </div>
        <div class="col-3">
          <label class="form-label" for="lastName">{{ $t('authors.items.lastName') }}</label>
          <input type="text" id="lastName" name="lastName" class="form-control" v-model="lastName"/>
        </div>
        <div class="col-2 customButton">
          <button type="submit" id="search" name="search" class="btn btn-primary">{{ $t('links.search') }}</button>
        </div>
      </div>
    </fieldset>
  </form>
</template>
