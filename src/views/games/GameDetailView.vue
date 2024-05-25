<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import GameMenu from '../../components/games/GameMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { getWikiCzUrl, getWikiEnUrl } from '../../model/common/Link.ts';
import { Result } from '../../model/common/Result.ts';
import { IGame } from '../../model/Game.ts';
import { GameStore } from '../../store/GameStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const {t} = useI18n();
const store = new GameStore();
const game = ref({} as IGame);
const loaded = ref(false);

loadGame();

async function loadGame() {
  await store.get(props.uuid).then((result: Result<IGame>) => {
    if (result.isOk()) {
      game.value = result.data!!;
      loaded.value = true;
    }
  });
}

function hasAdditionalData(): boolean {
  if (game.value.otherData) {
    return true;
  } else {
    return game.value.crack || game.value.serialKey || game.value.patch || game.value.trainer || game.value.trainerData || game.value.editor || game.value.saves;
  }
}

function formatAdditionalData(): string {
  const result = [];
  if (game.value.crack) {
    result.push(t('items.crack'));
  }
  if (game.value.serialKey) {
    if (result.length == 0) {
      result.push(t('items.serialKey'));
    } else {
      result.push(t('items.serialKey').toLowerCase());
    }
  }
  if (game.value.patch) {
    if (result.length == 0) {
      result.push(t('games.items.patch'));
    } else {
      result.push(t('games.items.patch').toLowerCase());
    }
  }
  if (game.value.trainer) {
    if (result.length == 0) {
      result.push(t('games.items.trainer'));
    } else {
      result.push(t('games.items.trainer').toLowerCase());
    }
  }
  if (game.value.trainerData) {
    if (result.length == 0) {
      result.push(t('games.items.trainerData'));
    } else {
      result.push(t('games.items.trainerData').toLowerCase());
    }
  }
  if (game.value.editor) {
    if (result.length == 0) {
      result.push(t('games.items.editor'));
    } else {
      result.push(t('games.items.editor').toLowerCase());
    }
  }
  if (game.value.saves) {
    if (result.length == 0) {
      result.push(t('games.items.saves'));
    } else {
      result.push(t('games.items.saves').toLowerCase());
    }
  }
  if (game.value.otherData) {
    result.push(game.value.otherData);
  }
  return result.join(', ');
}
</script>

<template>
  <GameMenu/>
  <div class="container-fluid">
    <h2>{{ t('games.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Game detail">
        <tbody>
          <tr>
            <td class="title">{{ t('items.name') }}</td>
            <td>{{ game.name }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.mediaCount') }}</td>
            <td>{{ game.mediaCount }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.format') }}</td>
            <td>{{ $t(`registers.${game.format}`) }}</td>
          </tr>
          <tr v-if="hasAdditionalData()">
            <td class="title">{{ t('items.additionalData') }}</td>
            <td>{{ formatAdditionalData() }}</td>
          </tr>
          <tr v-if="game.note">
            <td class="title">{{ t('items.note') }}</td>
            <td>{{ game.note }}</td>
          </tr>
          <tr v-if="game.cheat">
            <td colspan="2">
              <router-link :to="{name: 'cheats', params: {game: game.uuid}}">{{ t('cheats.title') }}</router-link>
            </td>
          </tr>
          <tr v-else>
            <td colspan="2">
              <router-link :to="{name: 'addCheats', params: {game: game.uuid}}">{{ t('cheats.form.add') }}</router-link>
            </td>
          </tr>
          <tr v-if="game.wikiCz">
            <td colspan="2">
              <a target="_blank" :href="getWikiCzUrl(game)">{{ $t('items.wikiCz') }}</a>
            </td>
          </tr>
          <tr v-if="game.wikiEn">
            <td colspan="2">
              <a target="_blank" :href="getWikiEnUrl(game)">{{ $t('items.wikiEn') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
