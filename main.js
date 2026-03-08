// main.js — App entry point

import { state, setState, subscribe } from './core/state.js';
import { scrollToId, watchScroll }    from './core/router.js';
import { parse }                      from './markdown/parser.js';
import { buildToc, countStats, readingTime } from './markdown/toc.js';
import {
  renderDoc, showEmpty, updateStatus,
  updateTitle, updateReadingTime, scrollToTop,
} from './ui/viewer.js';
import {
  renderToc, setActiveTocItem,
  updateFileInfo, setSidebarOpen,
} from './ui/sidebar.js';
import { readFile, isMarkdownDrop, getDroppedFile } from './files/loader.js';

// ─── Bootstrap ────────────────────────────────────────────

function init() {
  bindEvents();
  subscribe(onStateChange);
  setSidebarOpen(state.sidebarOpen);
}

// ─── Load a file ──────────────────────────────────────────

async function loadFile(file) {
  if (!file) return;

  try {
    const raw  = await readFile(file);
    const html = parse(raw);
    const toc  = buildToc(html);
    const { words, lines } = countStats(raw);

    setState({
      fileName:   file.name,
      rawContent: raw,
      htmlContent: html,
      toc,
      wordCount: words,
      lineCount: lines,
    });

    scrollToTop();
  } catch (err) {
    console.error('Failed to load file:', err);
  }
}

// ─── State → UI ───────────────────────────────────────────

function onStateChange(s) {
  if (s.htmlContent) {
    renderDoc(s.htmlContent);
  } else {
    showEmpty();
  }

  renderToc(s.toc, id => scrollToId(id));
  updateFileInfo(s.fileName);
  updateTitle(s.fileName);
  updateStatus({ words: s.wordCount, lines: s.lineCount });
  updateReadingTime(s.wordCount ? readingTime(s.wordCount) : '');
  setSidebarOpen(s.sidebarOpen);
}

// ─── Events ───────────────────────────────────────────────

function bindEvents() {
  const fileInput   = document.getElementById('file-input');
  const openBtn     = document.getElementById('open-btn');
  const toggleSbBtn = document.getElementById('toggle-sidebar');
  const viewer      = document.getElementById('viewer');
  const dragOverlay = document.getElementById('drag-overlay');

  const openFile = () => fileInput?.click();

  // Sidebar open button
  openBtn?.addEventListener('click', openFile);

  // Central "Open file" button — use event delegation since it may be re-rendered
  document.addEventListener('click', e => {
    if (e.target.closest('#empty-open-btn')) openFile();
  });

  // File input change
  fileInput?.addEventListener('change', e => {
    loadFile(e.target.files?.[0]);
    fileInput.value = '';
  });

  // Sidebar toggle
  toggleSbBtn?.addEventListener('click', () => {
    setState({ sidebarOpen: !state.sidebarOpen });
  });

  // Scroll → active TOC item
  if (viewer) {
    watchScroll(viewer, id => setActiveTocItem(id));
  }

  // Drag & drop
  let dragCounter = 0;

  document.addEventListener('dragenter', e => {
    e.preventDefault();
    if (!isMarkdownDrop(e.dataTransfer)) return;
    dragCounter++;
    dragOverlay?.classList.add('active');
  });

  document.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      dragOverlay?.classList.remove('active');
    }
  });

  document.addEventListener('dragover', e => e.preventDefault());

  document.addEventListener('drop', e => {
    e.preventDefault();
    dragCounter = 0;
    dragOverlay?.classList.remove('active');
    const file = getDroppedFile(e.dataTransfer);
    if (file) loadFile(file);
  });

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
      e.preventDefault();
      openFile();
    }
  });
}

// ─── Start ────────────────────────────────────────────────

init();