export default function SurgeIndicator({ surged, percentage }: { surged: boolean; percentage?: number }) {
  if (!surged) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7l-5 5h4l-1 5 5-6h-4l1-4z"/></svg>
      Surge +{percentage ?? 10}%
    </span>
  );
}
