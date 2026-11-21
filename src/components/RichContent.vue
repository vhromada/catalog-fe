<script setup lang="ts">
import { computed } from 'vue';
import { renderBbcode } from '../utils/Bbcode.ts';

const props = defineProps({
  content: {type: String, default: ''}
});
const html = computed(() => renderBbcode(props.content));
</script>

<template>
  <div class="rich-content" v-html="html"></div>
</template>
