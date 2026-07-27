import { useState } from 'react';

const URL_ERROR_MESSAGE = 'Enter a valid URL starting with http:// or https://.';

function isValidUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function UrlAnalysisForm({ isLoading = false, onSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const trimmedUrl = url.trim();

    if (!isValidUrl(trimmedUrl)) {
      setError(URL_ERROR_MESSAGE);
      return;
    }

    setError('');
    onSubmit(trimmedUrl);
  }

  function handleUrlChange(event) {
    setUrl(event.target.value);

    if (error) {
      setError('');
    }
  }

  return (
    <form className="mt-8 w-full max-w-2xl sm:mt-10" onSubmit={handleSubmit} noValidate>
      <label htmlFor="audit-url" className="mb-3 block text-sm font-medium text-slate-100">
        Webpage URL
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="audit-url"
          name="url"
          type="url"
          inputMode="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          disabled={isLoading}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'audit-url-error' : 'audit-url-hint'}
          className="min-h-12 w-full min-w-0 flex-1 rounded-lg border border-slate-500 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-500 focus-visible:border-cyan-300 focus-visible:ring-4 focus-visible:ring-cyan-300/25 disabled:cursor-not-allowed disabled:bg-slate-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 text-base font-semibold text-slate-950 shadow-sm outline-none transition hover:bg-cyan-200 focus-visible:ring-4 focus-visible:ring-cyan-300/35 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-700 sm:w-auto"
        >
          {isLoading ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-transparent"
              aria-hidden="true"
            />
          ) : null}
          <span>{isLoading ? 'Analyzing' : 'Analyze'}</span>
        </button>
      </div>

      <p id="audit-url-hint" className="sr-only">
        Enter a complete public URL beginning with http:// or https://.
      </p>

      {error ? (
        <p id="audit-url-error" className="mt-3 text-sm font-medium text-rose-200" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export default UrlAnalysisForm;
