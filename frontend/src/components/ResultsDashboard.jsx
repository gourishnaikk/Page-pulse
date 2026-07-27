import MetricCard from './MetricCard.jsx';

function getDisplayValue(value, fallback = 'Not found') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

function ResultsDashboard({ result }) {
  if (!result) {
    return null;
  }

  const metrics = [
    { label: 'Status Code', value: getDisplayValue(result.status) },
    { label: 'Response Time', value: getDisplayValue(result.responseTime) },
    { label: 'Title', value: getDisplayValue(result.title) },
    { label: 'Meta Description', value: getDisplayValue(result.metaDescription) },
    { label: 'H1 Count', value: getDisplayValue(result.h1Count, 0) },
    { label: 'Images Missing Alt', value: getDisplayValue(result.imagesWithoutAlt, 0) },
    { label: 'Word Count', value: getDisplayValue(result.wordCount, 0) },
  ];

  return (
    <section
      className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
      aria-labelledby="results-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2
            id="results-heading"
            className="text-xl font-bold tracking-normal text-slate-950 sm:text-2xl"
          >
            Results Dashboard
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Core SEO and accessibility metrics from the analyzed webpage.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </dl>
      </div>
    </section>
  );
}

export default ResultsDashboard;
