<script setup lang="ts">
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import ShowForm from '../../components/shows/ShowForm.vue';
import ShowMenu from '../../components/shows/ShowMenu.vue';
import { IResult } from '../../model/common/Result.ts';
import { ChangeShowRequest, Show } from '../../model/Show.ts';
import { ShowStore } from '../../store/ShowStore.ts';

const router = useRouter();
const store = new ShowStore();
const show = new Show();

async function onSubmit(request: ChangeShowRequest) {
  await store.add(request).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'shows'});
    }
  });
}

function onCancel() {
  router.push({name: 'shows'});
}
</script>

<template>
  <ShowMenu/>
  <div class="container-fluid">
    <h2>{{ $t('shows.form.add') }}</h2>
    <ShowForm :show="show" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
