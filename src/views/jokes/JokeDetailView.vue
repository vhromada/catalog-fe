<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import JokeMenu from '../../components/jokes/JokeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { Result } from '../../model/common/Result.ts';
import { type IJoke } from '../../model/Joke.ts';
import { JokeStore } from '../../store/JokeStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const {t} = useI18n();
const store = new JokeStore();
const joke = ref({} as IJoke);
const loaded = ref(false);

loadJoke();

async function loadJoke() {
  await store.get(props.uuid).then((result: Result<IJoke>) => {
    if (result.isOk()) {
      joke.value = result.data!;
      loaded.value = true;
    }
  });
}

function formatContent(joke: IJoke): string {
  return joke.content
      .replace(/</g, '&lt')
      .replace(/>/g, '&gt')
      .replace(/\n/g, '<br/>');
}
</script>

<template>
  <JokeMenu/>
  <div class="container-fluid">
    <h2>{{ t('jokes.detail') }}</h2>
    <span v-html="formatContent(joke)" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
