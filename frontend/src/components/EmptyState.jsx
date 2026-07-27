function EmptyState() {
  return (
    <section
      className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="empty-state-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center shadow-sm sm:px-10 sm:py-10">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-xl font-bold text-cyan-700"
            aria-hidden="true"
          >
            ?
          </div>

          <h2
            id="empty-state-heading"
            className="mt-5 text-xl font-bold tracking-normal text-slate-950 sm:text-2xl"
          >
            Your page audit will appear here
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Submit a public webpage URL to see status, timing, SEO metadata, content counts, and
            accessibility signals in one clean report.
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmptyState;
