import ErrorAlert from './ErrorAlert.jsx';
import LoadingIndicator from './LoadingIndicator.jsx';
import heroImage from '../assets/hero.png';
import UrlAnalysisForm from './UrlAnalysisForm.jsx';

function Hero({ errorMessage, isLoading, onAnalyze }) {
  return (
    <section className="relative isolate flex flex-1 items-center overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-1/2 top-8 -z-10 h-64 translate-x-1/2 opacity-20 sm:right-8 sm:top-1/2 sm:h-80 sm:-translate-y-1/2 sm:translate-x-0 sm:opacity-25 lg:right-16 lg:h-[28rem]"
      />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,#4338ca,transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)]" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 sm:mb-5 sm:text-sm">
            SEO and accessibility insights
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
            Analyze any webpage instantly
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:mt-6 sm:text-xl sm:leading-8">
            Enter a URL to inspect important SEO and accessibility metrics.
          </p>
          <UrlAnalysisForm isLoading={isLoading} onSubmit={onAnalyze} />
          {isLoading ? <LoadingIndicator /> : null}
          <ErrorAlert message={errorMessage} />
        </div>
      </div>
    </section>
  );
}

export default Hero;
