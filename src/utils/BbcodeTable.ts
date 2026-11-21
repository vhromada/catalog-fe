/**
 * Table editing helpers for BBCode text ([table], [tr], [th], [td]).
 * All functions are pure: they take the text and the cursor position and return the new text and cursor position.
 */

export type TableAction = 'addColumn' | 'removeColumn' | 'removeRow';

interface IEdit {
  from: number;
  to: number;
  text: string;
}

interface ICell {
  tag: string;
  start: number;
  end: number;
}

interface IRow {
  start: number;
  end: number;
  cells: ICell[];
}

interface ITable {
  start: number;
  end: number;
  rows: IRow[];
}

const TABLE_OPEN_LENGTH = '[table]'.length;
const TABLE_CLOSE_LENGTH = '[/table]'.length;
const ROW_CLOSE_LENGTH = '[/tr]'.length;

function parseRows(content: string, offset: number): IRow[] {
  return [...content.matchAll(/\[tr][\s\S]*?\[\/tr]/gi)].map((row) => {
    const start = offset + row.index;
    const cells = [...row[0].matchAll(/\[(td|th)][\s\S]*?\[\/\1]/gi)].map((cell) => ({
      tag: cell[1]!,
      start: start + cell.index,
      end: start + cell.index + cell[0].length
    }));
    return {start, end: start + row[0].length, cells};
  });
}

function findTable(text: string, cursor: number): ITable | undefined {
  for (const table of text.matchAll(/\[table][\s\S]*?\[\/table]/gi)) {
    const start = table.index;
    const end = start + table[0].length;
    if (cursor >= start + TABLE_OPEN_LENGTH && cursor <= end - TABLE_CLOSE_LENGTH) {
      return {start, end, rows: parseRows(table[0], start)};
    }
  }
  return undefined;
}

function removal(text: string, from: number, to: number): IEdit {
  let end = to;
  if (text.startsWith('\r\n', end)) {
    end += 2;
  } else if (text[end] === '\n') {
    end += 1;
  }
  return {from, to: end, text: ''};
}

function createEdits(text: string, table: ITable, current: IRow, column: number, action: TableAction): IEdit[] {
  const edits: IEdit[] = [];
  if (action === 'removeRow') {
    if (table.rows.length === 1) {
      edits.push(removal(text, table.start, table.end));
    } else {
      edits.push(removal(text, current.start, current.end));
    }
  } else if (action === 'removeColumn') {
    if (current.cells.length > 1) {
      for (const row of table.rows) {
        const cell = row.cells[column];
        if (cell) {
          edits.push({from: cell.start, to: cell.end, text: ''});
        }
      }
    }
  } else {
    for (const row of table.rows) {
      const reference = row.cells[Math.min(column, row.cells.length - 1)];
      if (reference) {
        edits.push({from: reference.end, to: reference.end, text: `[${reference.tag}][/${reference.tag}]`});
      } else {
        const position = row.end - ROW_CLOSE_LENGTH;
        edits.push({from: position, to: position, text: '[td][/td]'});
      }
    }
  }
  return edits;
}

/**
 * Applies the action to the table the cursor is in. The row and column are those at the cursor
 * (or the nearest preceding row when the cursor is between rows).
 *
 * @returns new text and cursor position, or undefined when nothing can be done
 */
export function applyTableAction(text: string, cursor: number, action: TableAction): { text: string; cursor: number } | undefined {
  const table = findTable(text, cursor);
  if (!table || table.rows.length === 0) {
    return undefined;
  }
  const current = table.rows.find((row) => cursor >= row.start && cursor <= row.end)
    ?? [...table.rows].reverse().find((row) => row.end <= cursor)
    ?? table.rows[0]!;
  const column = Math.max(current.cells.filter((cell) => cell.start <= cursor).length - 1, 0);
  const edits = createEdits(text, table, current, column, action);
  if (edits.length === 0) {
    return undefined;
  }
  let result = text;
  for (const edit of [...edits].reverse()) {
    result = result.slice(0, edit.from) + edit.text + result.slice(edit.to);
  }
  let shift = 0;
  let newCursor: number | undefined;
  for (const edit of edits) {
    const delta = edit.text.length - (edit.to - edit.from);
    if (edit.from < cursor && cursor < edit.to) {
      newCursor = edit.from + shift + edit.text.length;
      break;
    }
    if (edit.to < cursor || (edit.to === cursor && edit.from < edit.to)) {
      shift += delta;
    }
  }
  return {text: result, cursor: newCursor ?? cursor + shift};
}
