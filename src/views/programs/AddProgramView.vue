<script setup lang="ts">
import { useRouter } from 'vue-router';
import ProgramForm from '../../components/programs/ProgramForm.vue';
import ProgramMenu from '../../components/programs/ProgramMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult } from '../../model/common/Result.ts';
import { Program } from '../../model/Program.ts';
import { ProgramStore } from '../../store/ProgramStore.ts';

const router = useRouter();
const store = new ProgramStore();
const program = new Program();

async function onSubmit(program: Program) {
  await store.add(program).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'programs'});
    }
  });
}

function onCancel() {
  router.push({name: 'programs'});
}
</script>

<template>
  <ProgramMenu/>
  <div class="container-fluid">
    <h2>{{ $t('programs.form.add') }}</h2>
    <ProgramForm :program="program" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
