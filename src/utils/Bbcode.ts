/**
 * Minimal and safe BBCode renderer.
 *
 * Supported tags: [b], [i], [u], [h1], [h2], [color=x], [bg=x], [table], [tr], [th], [td].
 * All text is HTML escaped and only whitelisted tags are emitted, so the output is safe to use with `v-html`.
 */

interface ITag {
  open: (arg?: string) => string;
  close: string;
  arg?: 'required';
  block?: boolean;
}

const COLOR = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|[a-z]{3,20})$/i;
const TOKEN = /\[(\/?)([a-z0-9]+)(?:=([^\]]*))?]/gi;

const TAGS: Record<string, ITag> = {
  b: {open: () => '<strong>', close: '</strong>'},
  i: {open: () => '<em>', close: '</em>'},
  u: {open: () => '<u>', close: '</u>'},
  h1: {open: () => '<h3>', close: '</h3>', block: true},
  h2: {open: () => '<h4>', close: '</h4>', block: true},
  color: {open: (arg) => `<span style="color:${arg}">`, close: '</span>', arg: 'required'},
  bg: {open: (arg) => `<span style="background-color:${arg}">`, close: '</span>', arg: 'required'},
  table: {open: () => '<table>', close: '</table>', block: true},
  tr: {open: () => '<tr>', close: '</tr>', block: true},
  th: {open: () => '<th>', close: '</th>'},
  td: {open: () => '<td>', close: '</td>'}
};

const TABLE_STRUCTURE = ['table', 'tr'];

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderBbcode(source: string): string {
  const stack: string[] = [];
  let html = '';
  let last = 0;
  let skipNewline = false;

  const appendText = (raw: string) => {
    let text = raw;
    if (skipNewline) {
      text = text.replace(/^\r?\n/, '');
      skipNewline = false;
    }
    const top = stack[stack.length - 1];
    if (top && TABLE_STRUCTURE.includes(top) && text.trim() === '') {
      return;
    }
    html += escapeHtml(text).replace(/\r?\n/g, '<br/>');
  };

  for (const match of source.matchAll(TOKEN)) {
    const [raw, slash, rawName, arg] = match;
    const name = (rawName ?? '').toLowerCase();
    const tag = TAGS[name];
    appendText(source.slice(last, match.index));
    last = match.index + raw.length;
    if (!tag) {
      appendText(raw);
    } else if (slash) {
      const position = stack.lastIndexOf(name);
      if (position < 0 || arg !== undefined) {
        appendText(raw);
      } else {
        while (stack.length > position) {
          html += TAGS[stack.pop()!]!.close;
        }
        skipNewline = !!tag.block;
      }
    } else if (tag.arg === 'required' ? arg === undefined || !COLOR.test(arg) : arg !== undefined) {
      appendText(raw);
    } else {
      stack.push(name);
      html += tag.open(arg);
      skipNewline = !!tag.block;
    }
  }
  appendText(source.slice(last));
  while (stack.length > 0) {
    html += TAGS[stack.pop()!]!.close;
  }
  return html;
}
