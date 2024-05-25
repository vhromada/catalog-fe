<script setup lang="ts">
import { ref } from 'vue';
import ResultError from '../../components/ResultError.vue';
import SongMenu from '../../components/songs/SongMenu.vue';
import { Result } from '../../model/common/Result.ts';
import { ISong } from '../../model/Song.ts';
import { SongStore } from '../../store/SongStore.ts';

const props = defineProps({
  music: {type: String, required: true},
  uuid: {type: String, required: true}
});
const song = ref({} as ISong);
const store = new SongStore();
const loaded = ref(false);

loadSong();

async function loadSong() {
  await store.get(props.music, props.uuid).then((result: Result<ISong>) => {
    if (result.isOk()) {
      song.value = result.data!!;
      loaded.value = true;
    }
  });
}
</script>

<template>
  <SongMenu :music="props.music"/>
  <div class="container-fluid">
    <h2>{{ $t('songs.detail') }}</h2>
    <div class="table-responsive" v-if="loaded">
      <table class="table table-hover" aria-hidden="true" aria-describedby="Song detail">
        <tbody>
          <tr>
            <td class="title">{{ $t('items.name') }}</td>
            <td>{{ song.name }}</td>
          </tr>
          <tr>
            <td class="title">{{ $t('items.length') }}</td>
            <td>{{ song.formattedLength }}</td>
          </tr>
          <tr v-if="song.note">
            <td class="title">{{ $t('items.note') }}</td>
            <td>{{ song.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
