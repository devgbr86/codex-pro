// markdown/parser.js — Converts Markdown to HTML using marked

export function parse(markdown) {
  if (typeof marked === 'undefined') {
    throw new Error('marked.js not loaded');
  }

  marked.use({
    gfm: true,
    breaks: false,
    pedantic: false,
  });

  // Override heading renderer to add id anchors
  const renderer = new marked.Renderer();
  const headingIds = {};

  renderer.heading = function (token) {
    const text = token.text;
    const level = token.depth;

    // Build slug from text (strip HTML tags first)
    const clean = text.replace(/<[^>]+>/g, '');
    let slug = clean
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Deduplicate
    if (headingIds[slug] !== undefined) {
      headingIds[slug]++;
      slug = `${slug}-${headingIds[slug]}`;
    } else {
      headingIds[slug] = 0;
    }

    return `<h${level} id="${slug}">${text}</h${level}>\n`;
  };

  return marked.parse(markdown, { renderer });
}
