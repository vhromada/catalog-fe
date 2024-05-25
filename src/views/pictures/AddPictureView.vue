<script setup lang="ts">
import { useRouter } from 'vue-router';
import PictureForm from '../../components/pictures/PictureForm.vue';
import PictureMenu from '../../components/pictures/PictureMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult } from '../../model/common/Result.ts';
import { PictureStore } from '../../store/PictureStore.ts';

const router = useRouter();
const store = new PictureStore();

async function onSubmit(picture: File) {
  await store.add(picture).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'pictures'});
    }
  });
}

function onCancel() {
  router.push({name: 'pictures'});
}
</script>

<template>
  <PictureMenu/>
  <div class="container-fluid">
    <h2>{{ $t('pictures.form.add') }}</h2>
    <PictureForm @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
