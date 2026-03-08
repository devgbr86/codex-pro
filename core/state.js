// core/state.js — Central application state

export const state = {
  fileName:    null,   // string | null
  rawContent:  null,   // string | null
  htmlContent: null,   // string | null
  toc:         [],     // TocItem[]
  wordCount:   0,
  lineCount:   0,
  focusMode:   false,
  sidebarOpen: true,
};

const listeners = [];

export function getState() {
  return { ...state };
}

export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i !== -1) listeners.splice(i, 1);
  };
}
