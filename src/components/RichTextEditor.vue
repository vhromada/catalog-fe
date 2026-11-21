<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { applyTableAction, type TableAction } from '../utils/BbcodeTable.ts';
import RichContent from './RichContent.vue';
import ErrorMessage from './ErrorMessage.vue';

const props = defineProps({
  name: {type: String, required: true},
  label: {type: String, required: true}
});
const {t} = useI18n();
const {value, errors} = useField<string>(() => props.name);
const textarea = ref<HTMLTextAreaElement>();
const color = ref('#ff0000');
const background = ref('#ffff00');
const preview = ref(false);
const cursor = ref(0);
const inTable = computed(() => {
  const before = (value.value ?? '').slice(0, cursor.value).toLowerCase();
  return before.lastIndexOf('[table]') > before.lastIndexOf('[/table]');
});

async function wrap(tag: string, arg?: string) {
  const element = textarea.value;
  if (!element) {
    return;
  }
  const text = value.value ?? '';
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const open = arg ? `[${tag}=${arg}]` : `[${tag}]`;
  const close = `[/${tag}]`;
  value.value = text.slice(0, start) + open + text.slice(start, end) + close + text.slice(end);
  await nextTick();
  element.focus();
  element.setSelectionRange(start + open.length, end + open.length);
  updateCursor();
}

async function insert(template: string, atLineEnd = false, cursorFromEnd = 0) {
  const element = textarea.value;
  if (!element) {
    return;
  }
  const text = value.value ?? '';
  let position = element.selectionEnd;
  let insertion = template;
  if (atLineEnd) {
    const newline = text.indexOf('\n', position);
    if (newline < 0) {
      position = text.length;
      insertion = `\n${template}`;
    } else {
      position = newline + 1;
    }
  }
  value.value = text.slice(0, position) + insertion + text.slice(position);
  await nextTick();
  element.focus();
  const cursor = position + insertion.length - cursorFromEnd;
  element.setSelectionRange(cursor, cursor);
  updateCursor();
}

function updateCursor() {
  cursor.value = textarea.value?.selectionEnd ?? 0;
}

function row(cell: string, columns: number) {
  return `[tr]${`[${cell}][/${cell}]`.repeat(columns)}[/tr]\n`;
}

function columnCount() {
  const before = (value.value ?? '').slice(0, textarea.value?.selectionEnd ?? 0);
  const rows = before.match(/\[tr].*?\[\/tr]/gi);
  const last = rows?.[rows.length - 1];
  return last?.match(/\[t[dh]]/gi)?.length || 1;
}

async function changeTable(action: TableAction) {
  const element = textarea.value;
  if (!element) {
    return;
  }
  const result = applyTableAction(value.value ?? '', element.selectionEnd, action);
  if (!result) {
    return;
  }
  value.value = result.text;
  await nextTick();
  element.focus();
  element.setSelectionRange(result.cursor, result.cursor);
  updateCursor();
}

function insertTable() {
  return insert(`[table]\n${row('th', 1)}${row('td', 1)}[/table]\n`, false, '[/table]\n'.length);
}

function insertHeader() {
  return insert(row('th', columnCount()), true);
}

function insertRow() {
  return insert(row('td', columnCount()), true);
}
</script>

<template>
  <div class="col my-2">
    <label class="form-label" :for="props.name">{{ props.label }}</label>
    <div class="rich-toolbar">
      <button type="button" class="btn btn-outline-secondary btn-sm fw-bold" :title="t('richText.bold')" @click="wrap('b')">B</button>
      <button type="button" class="btn btn-outline-secondary btn-sm fst-italic" :title="t('richText.italic')" @click="wrap('i')">I</button>
      <button type="button" class="btn btn-outline-secondary btn-sm text-decoration-underline" :title="t('richText.underline')" @click="wrap('u')">U</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.heading')" @click="wrap('h1')">H1</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.subheading')" @click="wrap('h2')">H2</button>
      <input type="color" class="form-control form-control-color" v-model="color" :title="t('richText.color')"/>
      <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.color')" :style="{color: color}" @click="wrap('color', color)">A</button>
      <input type="color" class="form-control form-control-color" v-model="background" :title="t('richText.background')"/>
      <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.background')" :style="{backgroundColor: background}" @click="wrap('bg', background)">A</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.table')" @click="insertTable()">{{ t('richText.table') }}</button>
      <template v-if="inTable">
        <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.tableHeader')" @click="insertHeader()">{{ t('richText.tableHeader') }}</button>
        <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.tableRow')" @click="insertRow()">{{ t('richText.tableRow') }}</button>
        <button type="button" class="btn btn-outline-secondary btn-sm" :title="t('richText.tableAddColumn')" @click="changeTable('addColumn')">
          {{ t('richText.tableAddColumn') }}
        </button>
        <button type="button" class="btn btn-outline-danger btn-sm" :title="t('richText.tableRemoveRow')" @click="changeTable('removeRow')">
          {{ t('richText.tableRemoveRow') }}
        </button>
        <button type="button" class="btn btn-outline-danger btn-sm" :title="t('richText.tableRemoveColumn')" @click="changeTable('removeColumn')">
          {{ t('richText.tableRemoveColumn') }}
        </button>
      </template>
      <div class="form-check form-switch ms-2">
        <input type="checkbox" class="form-check-input" :id="`${props.name}Preview`" role="switch" v-model="preview"/>
        <label class="form-check-label" :for="`${props.name}Preview`">{{ t('richText.preview') }}</label>
      </div>
    </div>
    <textarea :id="props.name" :name="props.name" ref="textarea" class="form-control" rows="15" v-model="value" @click="updateCursor" @keyup="updateCursor" @select="updateCursor"
              @input="updateCursor" @focus="updateCursor"></textarea>
    <ErrorMessage :errors="errors"/>
    <div class="rich-preview" v-if="preview">
      <RichContent :content="value"/>
    </div>
  </div>
</template>
