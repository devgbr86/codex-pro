// markdown/toc.js — Extracts headings from rendered HTML

/**
 * @param {string} html  Rendered HTML string
 * @returns {Array<{id, text, level}>}
 */
export function buildToc(html) {
  const div = document.createElement('div');
  div.innerHTML = html;

  const items = [];
  const headings = div.querySelectorAll('h1, h2, h3, h4');

  headings.forEach(h => {
    items.push({
      id:    h.id,
      text:  h.textContent.trim(),
      level: parseInt(h.tagName[1], 10),
    });
  });

  return items;
}

/**
 * @param {string} markdown  Raw markdown text
 * @returns {{ words: number, lines: number }}
 */
export function countStats(markdown) {
  const lines = markdown.split('\n').length;
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return { words, lines };
}

/**
 * @param {number} words
 * @returns {string}  e.g. "4 min read"
 */
export function readingTime(words) {
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}
