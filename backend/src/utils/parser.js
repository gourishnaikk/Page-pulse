'use strict';

const cheerio = require('cheerio');

/**
 * Parses raw HTML and extracts SEO/accessibility metrics according to AGENTS.md rules.
 * 
 * @param {string} html - Raw HTML string
 * @returns {Object} Extracted metrics (title, metaDescription, h1Count, imagesWithoutAlt, wordCount)
 */
const parseHtml = (html) => {
  if (!html || typeof html !== 'string') {
    return {
      title: '',
      metaDescription: '',
      h1Count: 0,
      imagesWithoutAlt: 0,
      wordCount: 0,
    };
  }

  const $ = cheerio.load(html);

  // 1. HTML Page Title
  const titleTag = $('title').first();
  const title = titleTag.length ? titleTag.text().trim() : '';

  // 2. Meta Description (Case-insensitive check on name attribute with og:description fallback)
  let metaDescription = '';
  const metaDescTag = $('meta').filter((_i, el) => {
    const name = $(el).attr('name');
    return name && name.toLowerCase() === 'description';
  }).first();

  if (metaDescTag.length && metaDescTag.attr('content')) {
    metaDescription = metaDescTag.attr('content').trim();
  } else {
    // Fallback to og:description
    const ogDescTag = $('meta[property="og:description"]').first();
    if (ogDescTag.length && ogDescTag.attr('content')) {
      metaDescription = ogDescTag.attr('content').trim();
    }
  }

  // 3. H1 Header Count
  const h1Count = $('h1').length;

  // 4. Images without Alternative Text (missing alt OR alt is empty/whitespace only)
  let imagesWithoutAlt = 0;
  $('img').each((_i, el) => {
    const alt = $(el).attr('alt');
    if (typeof alt !== 'string' || alt.trim() === '') {
      imagesWithoutAlt += 1;
    }
  });

  // 5. Approximate Word Count
  // Clone body or document root to remove non-renderable text elements without mutating original
  const hasBodyTag = /<body\b[^>]*>/i.test(html);
  const cloneNode = hasBodyTag ? $('body').clone() : $.root().clone();
  cloneNode.find('script, style, nav, noscript, svg').remove();

  const rawText = cloneNode.text();
  const normalizedText = rawText.replace(/\s+/g, ' ').trim();
  const wordCount = normalizedText ? normalizedText.split(' ').filter(Boolean).length : 0;

  return {
    title,
    metaDescription,
    h1Count,
    imagesWithoutAlt,
    wordCount,
  };
};

module.exports = {
  parseHtml,
};
