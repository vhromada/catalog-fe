<script setup lang="ts">

const props = defineProps({
  errors: {type: Object},
});

function isLast(index: number) {
  return index < props.errors?.length - 1;
}
</script>

<template>
  <span class="error" v-for="(error, index) in props.errors" :key="error">
    {{ error }}
    <br v-if="isLast(Number(index))"/>
  </span>
</template>
