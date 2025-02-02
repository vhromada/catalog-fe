<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ModalEvent } from '../../model/common/View.ts';
import { PictureStore } from '../../store/PictureStore.ts';
import config from '../../utils/Config.ts';
import { emitter } from '../../utils/Event.ts';
import useModal from '../../utils/Modal.ts';

const emit = defineEmits(['choose']);
const {t} = useI18n();
const {content, focusElement, toggleBtn, open, close} = useModal();
const store = new PictureStore();
const picture = ref<string | undefined>();

store.getAll();

function handleEvent(event: ModalEvent<string>) {
  if (event.isOpen()) {
    picture.value = event.data;
    open();
  } else {
    onClose();
  }
}

function onClose() {
  emit('choose', picture.value);
  close();
}

onMounted(() => {
  emitter.on('picture', (event: any) => handleEvent(event));
});
</script>

<template>
  <div id="picturesModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" @keyup.esc.prevent="onClose">
    <div class="modal-dialog" role="document">
      <div ref="content" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <span>{{ t('links.choosePicture') }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click.prevent="close()"/>
        </div>
        <div class="modal-body">
          <label class="radio ps-3" v-for="pictureItem in store.pictures.value" :key="pictureItem">
            <input type="radio" :value="pictureItem" v-model="picture"/>
            <img alt="Picture" class="picture" :src="`${config.catalogUrl}public/pictures/${pictureItem}`"/>
          </label>
        </div>
        <div class="modal-footer">
          <button id="chooseFocus" ref="focusElement" type="button" name="choosePicture" class="btn btn-primary" data-bs-dismiss="modal" @click.prevent="onClose" v-if="picture">
            {{ t('links.choose') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <button id="pictureToggle" ref="toggleBtn" type="button" class="hidden" data-bs-toggle="modal" data-bs-target="#picturesModal">
    {{ t('links.show') }}
  </button>
</template>
