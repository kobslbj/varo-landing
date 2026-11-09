"use client";

import { track } from "@vercel/analytics";
import { useId, useRef, useState } from "react";

/**
 * visits × lift × spend: what a few more return visits are worth to a gym.
 * A formula with the owner's own numbers, labelled as such, not a forecast.
 */
export function RevenueCalc({
  labels,
}: {
  labels: {
    visits: string;
    price: string;
    lift: string;
    monthly: string;
    yearly: string;
    note: string;
  };
}) {
  const [visits, setVisits] = useState(1500);
  const [price, setPrice] = useState(450);
  const [lift, setLift] = useState(5);
  const tracked = useRef(false);
  const monthly = Math.round((visits * lift * price) / 100);
  const nt = (n: number) => `NT$${n.toLocaleString("en-US")}`;
  // Count that someone used it, once per visit.
  const touched = () => {
    if (tracked.current) return;
    tracked.current = true;
    track("gym_calc_used");
  };

  return (
    <div className="grid gap-6 rounded-[28px] border border-line bg-ink-2 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-12">
      <div className="space-y-7">
        <Slider
          label={labels.visits}
          max={8000}
          min={200}
          step={100}
          value={visits}
          valueLabel={visits.toLocaleString("en-US")}
          onChange={(v) => {
            touched();
            setVisits(v);
          }}
        />
        <Slider
          label={labels.price}
          max={1500}
          min={200}
          step={50}
          value={price}
          valueLabel={nt(price)}
          onChange={(v) => {
            touched();
            setPrice(v);
          }}
        />
        <Slider
          label={labels.lift}
          max={30}
          min={1}
          step={1}
          value={lift}
          valueLabel={`${lift}%`}
          onChange={(v) => {
            touched();
            setLift(v);
          }}
        />
      </div>
      <div className="theme-dark flex flex-col justify-center rounded-[20px] bg-night p-6 sm:p-8">
        <p className="text-[14px] font-semibold text-mute">{labels.monthly}</p>
        <p className="mt-2 text-[44px] font-black leading-none tracking-tight text-lime tabular sm:text-[56px]">
          {nt(monthly)}
        </p>
        <p className="mt-4 text-[15px] font-semibold text-cream tabular">
          {labels.yearly} {nt(monthly * 12)}
        </p>
        <p className="mt-6 text-[12px] leading-[1.6] text-mute">
          {labels.note}
        </p>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  valueLabel,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const id = useId();

  return (
    <div>
      <span className="flex items-baseline justify-between gap-3">
        <label className="text-[15px] font-bold" htmlFor={id}>
          {label}
        </label>
        <span className="text-[18px] font-black tabular">{valueLabel}</span>
      </span>
      <input
        aria-valuetext={valueLabel}
        className="mt-3 w-full accent-[#4a7a00]"
        id={id}
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
