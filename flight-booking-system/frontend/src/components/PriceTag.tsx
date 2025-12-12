export default function PriceTag({ base, current }: { base: number; current: number }) {
  const surged = current > base;
  return (
    <div className="text-right">
      <div className="text-lg font-semibold">₹{current}</div>
      {surged && (
        <div className="text-xs text-orange-600">Surged from ₹{base}</div>
      )}
    </div>
  );
}
