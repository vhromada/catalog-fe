<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import RichContent from '../../components/RichContent.vue';
import HandbookMenu from '../../components/handbooks/HandbookMenu.vue';
import { type IResult } from '../../model/common/Result.ts';
import { HandbookStore } from '../../store/HandbookStore.ts';

const props = defineProps({
  game: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new HandbookStore();

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
  <HandbookMenu :game="props.game"/>
  <div class="container-fluid">
    <h2>{{ t('handbooks.title') }}</h2>
    <div class="table-responsive" v-if="store.handbook.value.uuid">
      <table id="handbookOperations" class="table table-hover" aria-hidden="true" aria-describedby="Handbook operations">
        <tbody>
          <tr>
            <td data-nav="edit">
              <router-link :to="{name: 'editHandbooks', params: {game: props.game, uuid: store.handbook.value.uuid}}">{{ t('handbooks.form.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove()">{{ t('handbooks.form.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <RichContent :content="store.handbook.value.content" v-if="store.handbook.value.uuid"/>
  </div>
  <ResultError/>
</template>
