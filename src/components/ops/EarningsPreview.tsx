"use client";
import { useId, useState } from "react";
export function EarningsPreview() {
  const [amount, setAmount] = useState(200);
  const id = useId();
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 2,
    }).format(n);
  return (
    <div className="pro-earnings-preview">
      <span className="pro-kicker">A SIMPLE EXAMPLE · CAD</span>
      <div className="pro-earning-input">
        <label htmlFor={id}>Illustrative job amount</label>
        <strong>{fmt(amount)}</strong>
      </div>
      <input
        id={id}
        type="range"
        min="100"
        max="1500"
        step="25"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        aria-valuetext={fmt(amount)}
      />
      <div className="pro-earning-line">
        <span>Urbance commission · 7%</span>
        <b>−{fmt(amount * 0.07)}</b>
      </div>
      <div className="pro-earning-total">
        <span>Estimated provider earnings</span>
        <strong>{fmt(amount * 0.93)}</strong>
      </div>
      <small>
        Illustration only, before taxes, refunds and adjustments. Job volume,
        income and payout timing are not guaranteed.
      </small>
    </div>
  );
}
