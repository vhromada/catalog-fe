<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MusicMenu from '../../components/music/MusicMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { getWikiCzUrl, getWikiEnUrl } from '../../model/common/Link.ts';
import { Result } from '../../model/common/Result.ts';
import { type IMusic } from '../../model/Music.ts';
import { MusicStore } from '../../store/MusicStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const {t} = useI18n();
const store = new MusicStore();
const music = ref({} as IMusic);
const loaded = ref(false);

loadMusic();

async function loadMusic() {
  await store.get(props.uuid).then((result: Result<IMusic>) => {
    if (result.isOk()) {
      music.value = result.data!;
      loaded.value = true;
    }
  });
}
</script>

<template>
  <MusicMenu/>
  <div class="container-fluid">
    <h2>{{ t('music.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Detail of music">
        <tbody>
          <tr>
            <td class="title">{{ t('items.name') }}</td>
            <td>{{ music.name }}</td>
          </tr>
          <tr>
            <td class="title">{{ t('items.mediaCount') }}</td>
            <td>{{ music.mediaCount }}</td>
          </tr>
          <tr v-if="music.songsCount > 0">
            <td class="title">{{ t('music.statistics.songs') }}</td>
            <td>{{ music.songsCount }}</td>
          </tr>
          <tr v-if="music.songsCount > 0">
            <td class="title">{{ t('common.totalLength') }}</td>
            <td>{{ music.formattedLength }}</td>
          </tr>
          <tr v-if="music.note">
            <td class="title">{{ t('items.note') }}</td>
            <td>{{ music.note }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <router-link :to="{name: 'songs', params: {music: music.uuid}}">{{ t('songs.title') }}</router-link>
            </td>
          </tr>
          <tr v-if="music.wikiCz">
            <td colspan="2">
              <a target="_blank" :href="getWikiCzUrl(music)">{{ t('items.wikiCz') }}</a>
            </td>
          </tr>
          <tr v-if="music.wikiEn">
            <td colspan="2">
              <a target="_blank" :href="getWikiEnUrl(music)">{{ t('items.wikiEn') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
