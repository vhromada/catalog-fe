<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ResultError from '../../components/ResultError.vue';
import SongMenu from '../../components/songs/SongMenu.vue';
import { SongStore } from '../../store/SongStore.ts';

const props = defineProps({
  music: {type: String, required: true}
});
const {t} = useI18n();
const store = new SongStore();

store.load(props.music);

async function duplicate(uuid: string) {
  await store.duplicate(props.music, uuid);
}

async function remove(uuid: string) {
  await store.remove(props.music, uuid);
}

async function first() {
  await store.first(props.music);
}

async function previous() {
  await store.previous(props.music);
}

async function next() {
  await store.next(props.music);
}

async function last() {
  await store.last(props.music);
}
</script>

<template>
  <SongMenu :music="props.music"/>
  <div class="container-fluid">
    <h2>{{ t('songs.title') }}</h2>
    <div class="table-responsive" v-if="store.exists()">
      <table id="songs" class="table table-hover" aria-describedby="List of songs">
        <thead>
          <tr>
            <th data-nav="name">{{ t('songs.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in store.songs.value" :key="song.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'songDetail', params: {music: props.music, uuid: song.uuid}}">{{ song.name }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(song.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editSong', params: {music: props.music, uuid: song.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(song.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Songs pagination" v-if="store.isPagingAllowed()">
      <ul class="pagination justify-content-center">
        <li class="page-item" v-if="store.canPrevious()">
          <a id="first" href="#" class="page-link" aria-label="First" @click="first()">&laquo;&laquo;</a>
        </li>
        <li class="page-item" v-if="store.canPrevious()">
          <a id="previous" href="#" class="page-link" aria-label="Previous" @click="previous()">&laquo;</a>
        </li>
        <li class="page-item">
          <a id="pageInfo" href="#" class="page-link disabled">{{ store.getPage() }}</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="next" href="#" class="page-link" aria-label="Next" @click="next()">&raquo;</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="last" href="#" class="page-link" aria-label="Last" @click="last()">&raquo;&raquo;</a>
        </li>
      </ul>
    </nav>
    <span id="noData" v-if="!store.exists">{{ t('songs.noData') }}</span>
  </div>
  <ResultError/>
</template>
