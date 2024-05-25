<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProgramForm from '../../components/programs/ProgramForm.vue';
import ProgramMenu from '../../components/programs/ProgramMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { IResult, Result } from '../../model/common/Result.ts';
import { IProgram, Program } from '../../model/Program.ts';
import { ProgramStore } from '../../store/ProgramStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const store = new ProgramStore();
const program = ref({} as Program);
const loaded = ref(false);

loadProgram();

async function loadProgram() {
  await store.get(props.uuid).then((result: Result<IProgram>) => {
    if (result.isOk()) {
      program.value = new Program(result.data!!);
      loaded.value = true;
    }
  });
}

async function onSubmit(program: Program) {
  await store.update(props.uuid, program).then((result: IResult) => {
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
    <h2>{{ $t('programs.form.edit') }}</h2>
    <ProgramForm :program="program" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
