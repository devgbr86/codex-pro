// ui/sidebar.js — Renders TOC and handles sidebar toggle

export function renderToc(items, onItemClick) {
  const container = document.getElementById('toc-container');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<span class="toc-empty">—</span>';
    return;
  }

  const frag = document.createDocumentFragment();

  items.forEach(({ id, text, level }) => {
    const a = document.createElement('a');
    a.className = 'toc-item';
    a.dataset.level = level;
    a.dataset.id = id;
    a.textContent = text;
    a.title = text;

    a.addEventListener('click', e => {
      e.preventDefault();
      onItemClick(id);
    });

    frag.appendChild(a);
  });

  container.innerHTML = '';
  container.appendChild(frag);
}

export function setActiveTocItem(id) {
  document.querySelectorAll('.toc-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

export function updateFileInfo(fileName) {
  const el = document.getElementById('file-info');
  if (el) el.textContent = fileName ?? 'no file open';
}

export function setSidebarOpen(open) {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('collapsed', !open);
}
