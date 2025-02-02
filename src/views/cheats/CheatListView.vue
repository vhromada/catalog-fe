<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import CheatMenu from '../../components/cheats/CheatMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult } from '../../model/common/Result.ts';
import { CheatStore } from '../../store/CheatStore.ts';

const props = defineProps({
  game: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new CheatStore();

store.load(props.game);

async function remove() {
  await store.remove(props.game).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'games'});
    }
  });
}
</script>

<template>
  <CheatMenu :game="props.game"/>
  <div class="container-fluid">
    <h2>{{ t('cheats.title') }}</h2>
    <div class="table-responsive" v-if="store.cheat.value.uuid">
      <table id="cheatOperations" class="table table-hover" aria-hidden="true" aria-describedby="Cheat operations">
        <tbody>
          <tr>
            <td data-nav="edit">
              <router-link :to="{name: 'editCheats', params: {game: props.game, uuid: store.cheat.value.uuid}}">{{ t('cheats.form.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove()">{{ t('cheats.form.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-responsive">
      <table id="cheatSettings" class="table table-hover" aria-hidden="true" aria-describedby="Cheat settings">
        <tbody>
          <tr data-nav="gameSetting">
            <td data-nav="label">{{ t('cheats.items.gameSetting') }}</td>
            <td data-nav="data">{{ store.cheat.value.gameSetting }}</td>
          </tr>
          <tr data-nav="cheatSetting">
            <td data-nav="label">{{ t('cheats.items.cheatSetting') }}</td>
            <td data-nav="data">{{ store.cheat.value.cheatSetting }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-responsive">
      <table id="cheats" class="table table-hover" aria-describedby="List of cheats">
        <thead>
          <tr>
            <th data-nav="action">{{ t('cheats.items.action') }}</th>
            <th data-nav="description">{{ t('items.description') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cheatData, index) in store.cheat.value.data" :key="index">
            <td data-nav="action">{{ cheatData.action }}</td>
            <td data-nav="description">{{ cheatData.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
