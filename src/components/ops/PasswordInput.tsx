"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

export default function PasswordInput({ label = "Password", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string }) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const id = props.id || generatedId;
  return (
    <div className="pro-password-control">
      <label htmlFor={id}>{label}</label>
      <span className="pro-password-field">
      <input {...props} id={id} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="pro-password-toggle"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={id}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
      </span>
    </div>
  );
}
