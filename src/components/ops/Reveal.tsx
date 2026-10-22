"use client";
import { useEffect } from "react";
export function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    targets.forEach((t) => {
      t.classList.add("pro-reveal-ready");
      observer.observe(t);
    });
    return () => {
      observer.disconnect();
      targets.forEach((t) => t.classList.remove("pro-reveal-ready"));
    };
  }, []);
  return null;
}
