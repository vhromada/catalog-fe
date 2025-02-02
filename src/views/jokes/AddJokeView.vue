<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import JokeForm from '../../components/jokes/JokeForm.vue';
import JokeMenu from '../../components/jokes/JokeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Joke } from '../../model/Joke.ts';
import { JokeStore } from '../../store/JokeStore.ts';

const router = useRouter();
const {t} = useI18n();
const store = new JokeStore();
const joke = new Joke();

async function onSubmit(joke: Joke) {
  await store.add(joke).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'jokes'});
    }
  });
}

function onCancel() {
  router.push({name: 'jokes'});
}
</script>

<template>
  <JokeMenu/>
  <div class="container-fluid">
    <h2>{{ t('jokes.form.add') }}</h2>
    <JokeForm :joke="joke" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
