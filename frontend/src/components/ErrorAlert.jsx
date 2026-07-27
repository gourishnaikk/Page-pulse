function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="mt-6 w-full max-w-2xl rounded-lg border border-rose-200/50 bg-rose-500/15 px-4 py-3 text-sm text-rose-50"
      role="alert"
    >
      <p className="font-semibold">Analysis failed</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}

export default ErrorAlert;
