import { Brand } from "@/components/ops/Brand";
export default function Loading() {
  return (
    <div
      className="pro-route-loading"
      role="status"
      aria-label="Opening your workspace"
    >
      <aside>
        <Brand light subtitle="PRO WORKSPACE" />
        <div className="pro-loading-links">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </aside>
      <div>
        <div className="pro-loading-top" />
        <div className="pro-loading-heading" />
        <div className="pro-loading-banner" />
        <div className="pro-loading-stats">
          {Array.from({ length: 4 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <p>Opening your workspace…</p>
      </div>
    </div>
  );
}
