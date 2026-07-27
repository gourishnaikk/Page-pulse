function LoadingIndicator() {
  return (
    <div
      className="mt-6 flex w-full max-w-2xl items-center gap-3 rounded-lg border border-cyan-200/30 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-100"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-100 border-t-transparent"
        aria-hidden="true"
      />
      <span>Analyzing website...</span>
    </div>
  );
}

export default LoadingIndicator;
