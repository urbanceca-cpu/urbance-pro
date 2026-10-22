"use client";
import { Brand } from "@/components/ops/Brand";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="pro-work-loading">
      <Brand />
      <h1>Let’s reconnect.</h1>
      <p>Your workspace could not be opened. Please retry.</p>
      <button className="pro-button" onClick={reset}>
        Try again
      </button>
      <a href="https://www.urbance.ca/contact.html">Contact Urbance</a>
    </div>
  );
}
