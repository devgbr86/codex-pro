// ui/viewer.js — Renders document HTML into the content pane

export function renderDoc(html) {
  const content = document.getElementById('content');

  // Remove empty state if present
  const empty = content.querySelector('#empty-state');
  if (empty) empty.remove();

  content.innerHTML = html;
}

export function showEmpty() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div id="empty-state">
      <div class="empty-icon">◈</div>
      <div class="empty-title">Markdown Viewer</div>
      <div class="empty-sub">Open a .md file or drag it here.</div>
      <button class="empty-open-btn" id="empty-open-btn">Open file</button>
    </div>
  `;
  // Re-attach event so the button still works
  const btn = content.querySelector('#empty-open-btn');
  if (btn) btn.addEventListener('click', () => document.getElementById('file-input').click());
}

export function updateStatus({ words, lines }) {
  const w = document.getElementById('status-words');
  const l = document.getElementById('status-lines');
  if (w) w.textContent = `${words.toLocaleString()} words`;
  if (l) l.textContent = `${lines.toLocaleString()} lines`;
}

export function updateTitle(fileName) {
  const t = document.getElementById('doc-title');
  if (t) t.textContent = fileName ?? '';
  document.title = fileName ? `${fileName} — md` : 'md';
}

export function updateReadingTime(text) {
  const r = document.getElementById('reading-time');
  if (r) r.textContent = text;
}

export function scrollToTop() {
  const viewer = document.getElementById('viewer');
  if (viewer) viewer.scrollTop = 0;
}
