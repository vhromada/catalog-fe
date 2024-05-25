<script setup lang="ts">
import PictureMenu from '../../components/pictures/PictureMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { PictureStore } from '../../store/PictureStore.ts';
import config from '../../utils/Config.ts';

const store = new PictureStore();

store.load();

async function remove(uuid: string) {
  await store.remove(uuid);
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
  <PictureMenu/>
  <div class="container-fluid">
    <h2>{{ $t('pictures.title') }}</h2>
    <div class="table-responsive" v-if="store.exists()">
      <table id="pictures" class="table table-hover" aria-describedby="List of pictures">
        <thead>
          <tr>
            <th data-nav="image">{{ $t('pictures.header') }}</th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="picture in store.pictures.value" :key="picture">
            <td data-nav="image">
              <img alt="Picture" class="picture" :src="`${config.catalogUrl}public/pictures/${picture}`"/>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(picture)">{{ $t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Pictures pagination" v-if="store.isPagingAllowed()">
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
    <span id="noData" v-if="!store.exists">{{ $t('pictures.noData') }}</span>
  </div>
  <ResultError/>
</template>
