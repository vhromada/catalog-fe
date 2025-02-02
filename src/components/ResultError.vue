<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type IResult } from '../model/common/Result.ts';
import { ModalEvent } from '../model/common/View.ts';
import { emitter } from '../utils/Event.ts';
import useModal from '../utils/Modal.ts';

const {t} = useI18n();
const result = ref<IResult | undefined>();
const {content, focusElement, toggleBtn, open, close} = useModal();

function handleEvent(event: ModalEvent<IResult>) {
  if (event.isOpen()) {
    result.value = event.data;
    open();
  } else {
    close();
  }
}

onMounted(() => {
  emitter.on('result-error', (event: any) => handleEvent(event));
});
</script>

<template>
  <div id="resultError" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" @keyup.esc.prevent="close()">
    <div class="modal-dialog modal-lg" role="document">
      <div ref="content" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-uppercase">
            <span class="text-danger">{{ t('errors.title') }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click.prevent="close()"/>
        </div>
        <div class="modal-body">
          <table>
            <tbody>
              <tr>
                <td>
                  {{ t('errors.items.code') }}
                </td>
                <td>
                  <code>{{ result?.error?.code }}</code>
                </td>
              </tr>
              <tr>
                <td>
                  {{ t('errors.items.message') }}
                </td>
                <td>
                  <code>{{ result?.error?.message }}</code>
                </td>
              </tr>
              <tr>
                <td>
                  {{ t('errors.items.stack') }}
                </td>
                <td v-if="result?.error?.response?.data">
                  <code>{{ result?.error?.response?.data }}</code>
                </td>
                <td v-if="!result?.error?.response?.data && result?.error?.detail">
                  <code>{{ result?.error?.detail }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button id="resultErrorFocus" ref="focusElement" type="button" class="btn btn-secondary" data-bs-dismiss="modal" @keyup.esc.prevent="close()" @click.prevent="() => close()">
            {{ t('links.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <button id="resultErrorToggle" ref="toggleBtn" type="button" class="hidden" data-bs-toggle="modal" data-bs-target="#resultError">
    {{ t('links.show') }}
  </button>
</template>
