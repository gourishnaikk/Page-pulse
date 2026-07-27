'use strict';

const { parseHtml } = require('../../utils/parser');

describe('parseHtml', () => {
  test('returns empty metrics when HTML is missing or not a string', () => {
    const expectedMetrics = {
      title: '',
      metaDescription: '',
      h1Count: 0,
      imagesWithoutAlt: 0,
      wordCount: 0,
    };

    expect(parseHtml()).toEqual(expectedMetrics);
    expect(parseHtml({})).toEqual(expectedMetrics);
  });

  test('extracts all supported metrics and ignores non-visible word-count content', () => {
    const html = `
      <html>
        <head>
          <title>  Page Pulse Test  </title>
          <meta name="DESCRIPTION" content="  Primary description  ">
        </head>
        <body>
          <nav>Navigation words</nav>
          <h1>First heading</h1>
          <h1>Second heading</h1>
          <p>Visible content words.</p>
          <img src="missing-alt.png">
          <img src="empty-alt.png" alt="   ">
          <img src="valid-alt.png" alt="A valid description">
          <script>Hidden script words</script>
          <style>Hidden style words</style>
          <noscript>Hidden fallback words</noscript>
          <svg><text>Hidden SVG words</text></svg>
        </body>
      </html>
    `;

    expect(parseHtml(html)).toEqual({
      title: 'Page Pulse Test',
      metaDescription: 'Primary description',
      h1Count: 2,
      imagesWithoutAlt: 2,
      wordCount: 7,
    });
  });

  test('uses the Open Graph description when the standard meta description is absent', () => {
    const html = `
      <html>
        <head><meta property="og:description" content="  Social description  "></head>
        <body>One two</body>
      </html>
    `;

    expect(parseHtml(html)).toMatchObject({
      title: '',
      metaDescription: 'Social description',
      h1Count: 0,
      imagesWithoutAlt: 0,
      wordCount: 2,
    });
  });

  test('uses the Open Graph description when the standard meta description has no content', () => {
    const html = `
      <html>
        <head>
          <meta name="description">
          <meta property="og:description" content="Fallback description">
        </head>
      </html>
    `;

    expect(parseHtml(html).metaDescription).toBe('Fallback description');
  });

  test('falls back to the document root when body is absent', () => {
    expect(parseHtml('<title>Title only</title><p>Root text</p>')).toMatchObject({
      title: 'Title only',
      wordCount: 3,
    });
  });
});
