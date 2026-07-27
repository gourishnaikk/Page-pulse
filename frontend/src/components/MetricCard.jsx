function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
        {value}
      </dd>
    </div>
  );
}

export default MetricCard;
