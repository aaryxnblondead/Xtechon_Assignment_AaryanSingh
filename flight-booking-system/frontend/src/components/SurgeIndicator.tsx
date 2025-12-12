export default function SurgeIndicator({ surged, percentage }: { surged: boolean; percentage?: number }) {
  if (!surged) return null;
  return (
    <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
      Surge +{percentage ?? 10}%
    </span>
  );
}
