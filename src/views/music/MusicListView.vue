<script setup lang="ts">
import MusicMenu from '../../components/music/MusicMenu.vue';
import NameSearchForm from '../../components/NameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { MusicStore } from '../../store/MusicStore.ts';

const store = new MusicStore();

store.load();

async function duplicate(uuid: string) {
  await store.duplicate(uuid);
}

async function remove(uuid: string) {
  await store.remove(uuid);
}

async function search(name: string) {
  await store.search(name);
}

async function first() {
  await store.first();
}

async function previous() {
  await store.previous();
}

async function next() {
  await store.next();
}

async function last() {
  await store.last();
}
</script>

<template>
  <MusicMenu/>
  <div class="container-fluid">
    <h2>{{ $t('music.title') }}</h2>
    <NameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="musicList" class="table table-hover" aria-describedby="List of music">
        <thead>
          <tr>
            <th data-nav="name">{{ $t('music.title') }}</th>
            <th data-nav="songs"></th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="music in store.musicList.value" :key="music.uuid">
            <td data-nav="name">
              <router-link :to="{name: 'musicDetail', params: {uuid: music.uuid}}">{{ music.name }}</router-link>
            </td>
            <td data-nav="songs">
              <router-link :to="{name: 'songs', params: {music: music.uuid}}">{{ $t('songs.title') }}</router-link>
            </td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(music.uuid)">{{ $t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editMusic', params: {uuid: music.uuid}}">{{ $t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(music.uuid)">{{ $t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Music pagination" v-if="store.isPagingAllowed()">
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
    <div class="table-responsive">
      <table id="statistics" class="table" aria-describedby="Statistics for music">
        <thead>
          <tr>
            <th data-nav="count">{{ $t('music.statistics.count') }}</th>
            <th data-nav="mediaCount">{{ $t('items.mediaCount') }}</th>
            <th data-nav="songsCount">{{ $t('music.statistics.songs') }}</th>
            <th data-nav="totalLength">{{ $t('common.totalLength') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
            <td data-nav="mediaCount">{{ store.statistics.value.mediaCount }}</td>
            <td data-nav="songsCount">{{ store.statistics.value.songsCount }}</td>
            <td data-nav="totalLength">{{ store.statistics.value.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
