"use client";
import { useEffect, useRef } from 'react';
// Using any to avoid optional type dependency; Next handles ESM import fine
// eslint-disable-next-line @typescript-eslint/no-var-requires
const noUiSlider: any = require('nouislider');

type Props = {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (range: [number, number]) => void;
};

export default function PriceRangeSlider({ min, max, value, step = 50, onChange }: Props) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderInstance = useRef<any>(null);

  // init
  useEffect(() => {
    if (!sliderRef.current) return;
    if (sliderInstance.current) return; // already initialized
    sliderInstance.current = noUiSlider.create(sliderRef.current, {
      start: value,
      connect: true,
      step,
      range: { min, max },
      tooltips: [true, true],
      format: {
        to: (v: number) => `₹${Math.round(v)}`,
        from: (v: string) => parseInt(v.replace(/[^0-9]/g, ''), 10) || 0,
      },
    });
    sliderInstance.current.on('change', (vals: string[]) => {
      const [a, b] = vals.map((v) => parseInt(String(v).replace(/[^0-9]/g, ''), 10));
      onChange([a, b] as [number, number]);
    });
    return () => {
      if (sliderInstance.current) {
        sliderInstance.current.destroy();
        sliderInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync on prop changes
  useEffect(() => {
    if (!sliderInstance.current) return;
    sliderInstance.current.updateOptions({ range: { min, max }, step }, false);
    sliderInstance.current.set(value);
  }, [min, max, step, value]);

  return (
    <div className="space-y-2">
      <div ref={sliderRef} />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: ₹{Math.round(value[0])}</span>
        <span>Max: ₹{Math.round(value[1])}</span>
      </div>
    </div>
  );
}
