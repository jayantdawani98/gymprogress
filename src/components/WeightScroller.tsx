import { useEffect, useRef, useState } from "react";

const ITEM = 36; // px height of each value
const VISIBLE = 3; // number of visible rows (odd, so one is centered)

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Vertical scroll picker (wheel) used for reps and weight. Scroll to a value
 * and it snaps; the centered value is the selection.
 * Exercise logging uses step 1 for reps and 0.5 kg for weight.
 */
export function WeightScroller({
  value,
  onChange,
  min = 0,
  max = 200,
  step = 2.5,
  tint,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  tint: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = Math.round((max - min) / step) + 1;
  const values = Array.from({ length: count }, (_, i) => min + i * step);
  const indexOf = (v: number) => clamp(Math.round((v - min) / step), 0, count - 1);
  const [active, setActive] = useState(() => indexOf(value));

  // Keep scroll position in sync when the value changes from outside.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = indexOf(value);
    const target = idx * ITEM;
    if (Math.abs(el.scrollTop - target) > 1) {
      el.scrollTop = target;
    }
    setActive(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleScroll() {
    const el = ref.current;
    if (!el) return;
    const idx = clamp(Math.round(el.scrollTop / ITEM), 0, count - 1);
    if (idx !== active) {
      setActive(idx);
      const v = min + idx * step;
      if (v !== value) onChange(v);
    }
  }

  return (
    <div className="wscroll" style={{ height: ITEM * VISIBLE }}>
      <div className="wscroll-band" style={{ borderColor: tint }} />
      <div className="wscroll-track" ref={ref} onScroll={handleScroll}>
        {values.map((v, i) => (
          <div
            key={v}
            className={"wscroll-item" + (i === active ? " active" : "")}
            style={i === active ? { color: tint } : undefined}
            onClick={() => {
              ref.current?.scrollTo({ top: i * ITEM, behavior: "smooth" });
            }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
