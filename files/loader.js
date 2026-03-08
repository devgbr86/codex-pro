// files/loader.js — File reading (input element + drag-and-drop)

/**
 * Reads a File object and resolves with its text content.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'utf-8');
  });
}

/**
 * Returns true if a DataTransfer contains at least one .md / .markdown file.
 * @param {DataTransfer} dt
 */
export function isMarkdownDrop(dt) {
  if (!dt || !dt.items) return false;
  return Array.from(dt.items).some(item => {
    if (item.kind !== 'file') return false;
    const name = item.getAsFile()?.name ?? '';
    return /\.(md|markdown|txt)$/i.test(name);
  });
}

/**
 * Extracts the first markdown file from a drop event's DataTransfer.
 * @param {DataTransfer} dt
 * @returns {File|null}
 */
export function getDroppedFile(dt) {
  if (!dt || !dt.files) return null;
  return Array.from(dt.files).find(f => /\.(md|markdown|txt)$/i.test(f.name)) ?? null;
}
