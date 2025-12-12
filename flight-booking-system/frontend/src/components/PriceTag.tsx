export default function PriceTag({ base, current }: { base: number; current: number }) {
  const surged = current > base;
  return (
    <div className="text-right min-w-[120px]">
      <div className="text-2xl font-bold text-gray-900">₹{current.toFixed(0)}</div>
      {surged ? (
        <div className="text-xs text-orange-600">Surged from ₹{base.toFixed(0)}</div>
      ) : (
        <div className="text-xs text-gray-500">Base fare</div>
      )}
    </div>
  );
}
