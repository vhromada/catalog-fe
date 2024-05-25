<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import JokeForm from '../../components/jokes/JokeForm.vue';
import JokeMenu from '../../components/jokes/JokeMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult, Result } from '../../model/common/Result.ts';
import { IJoke, Joke } from '../../model/Joke.ts';
import { JokeStore } from '../../store/JokeStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new JokeStore();
const joke = ref({} as Joke);
const loaded = ref(false);

loadJoke();

async function loadJoke() {
  await store.get(props.uuid).then((result: Result<IJoke>) => {
    if (result.isOk()) {
      joke.value = new Joke(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(joke: Joke) {
  await store.update(props.uuid, joke).then((result: IResult) => {
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
    <h2>{{ $t('jokes.form.edit') }}</h2>
    <JokeForm :joke="joke" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
