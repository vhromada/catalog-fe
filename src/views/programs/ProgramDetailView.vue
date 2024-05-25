<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProgramMenu from '../../components/programs/ProgramMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { getWikiCzUrl, getWikiEnUrl } from '../../model/common/Link.ts';
import { Result } from '../../model/common/Result.ts';
import { IProgram } from '../../model/Program.ts';
import { ProgramStore } from '../../store/ProgramStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const {t} = useI18n();
const store = new ProgramStore();
const program = ref({} as IProgram);
const loaded = ref(false);

loadProgram();

async function loadProgram() {
  await store.get(props.uuid).then((result: Result<IProgram>) => {
    if (result.isOk()) {
      program.value = result.data!!;
      loaded.value = true;
    }
  });
}

function hasAdditionalData(): boolean {
  if (program.value.otherData) {
    return true;
  } else {
    return program.value.crack || program.value.serialKey;
  }
}

function formatAdditionalData(): string {
  const result = [];
  if (program.value.crack) {
    result.push(t('items.crack'));
  }
  if (program.value.serialKey) {
    if (result.length == 0) {
      result.push(t('items.serialKey'));
    } else {
      result.push(t('items.serialKey').toLowerCase());
    }
  }
  if (program.value.otherData) {
    result.push(program.value.otherData);
  }
  return result.join(', ');
}
</script>

<template>
  <ProgramMenu/>
  <div class="container-fluid">
    <h2>{{ $t('programs.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Detail of program">
        <tbody>
          <tr>
            <td class="title">{{ t('items.name') }}</td>
            <td>{{ program.name }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.mediaCount') }}</td>
            <td>{{ program.mediaCount }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.format') }}</td>
            <td>{{ $t(`registers.${program.format}`) }}</td>
          </tr>
          <tr v-if="hasAdditionalData()">
            <td class="title">{{ t('items.additionalData') }}</td>
            <td>{{ formatAdditionalData() }}</td>
          </tr>
          <tr v-if="program.note">
            <td class="title">{{ t('items.note') }}</td>
            <td>{{ program.note }}</td>
          </tr>
          <tr v-if="program.wikiCz">
            <td colspan="2">
              <a target="_blank" :href="getWikiCzUrl(program)">{{ $t('items.wikiCz') }}</a>
            </td>
          </tr>
          <tr v-if="program.wikiEn">
            <td colspan="2">
              <a target="_blank" :href="getWikiEnUrl(program)">{{ $t('items.wikiEn') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
