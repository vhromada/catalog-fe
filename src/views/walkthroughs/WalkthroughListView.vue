<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ResultError from '../../components/ResultError.vue';
import RichContent from '../../components/RichContent.vue';
import WalkthroughMenu from '../../components/walkthroughs/WalkthroughMenu.vue';
import { type IResult } from '../../model/common/Result.ts';
import { WalkthroughStore } from '../../store/WalkthroughStore.ts';

const props = defineProps({
  game: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new WalkthroughStore();

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
  <WalkthroughMenu :game="props.game"/>
  <div class="container-fluid">
    <h2>{{ t('walkthroughs.title') }}</h2>
    <div class="table-responsive" v-if="store.walkthrough.value.uuid">
      <table id="walkthroughOperations" class="table table-hover" aria-hidden="true" aria-describedby="Walkthrough operations">
        <tbody>
          <tr>
            <td data-nav="edit">
              <router-link :to="{name: 'editWalkthroughs', params: {game: props.game, uuid: store.walkthrough.value.uuid}}">{{ t('walkthroughs.form.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove()">{{ t('walkthroughs.form.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <RichContent :content="store.walkthrough.value.content" v-if="store.walkthrough.value.uuid"/>
  </div>
  <ResultError/>
</template>
