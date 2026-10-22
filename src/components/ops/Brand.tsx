export function Brand({
  light = false,
  subtitle = "FOR PROFESSIONALS",
}: {
  light?: boolean;
  subtitle?: string;
}) {
  return (
    <span className={"pro-brand" + (light ? " is-light" : "")}>
      <img
        src={light ? "/brand/wordmark-white.png" : "/brand/wordmark-ink.png"}
        width="132"
        height="40"
        alt="Urbance"
      />
      <span>{subtitle}</span>
    </span>
  );
}
const paths: Record<string, string> = {
  overview: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  jobs: "M8 6V4h8v2 M3 7h18v14H3z M3 12h18 M10 11v3h4v-3",
  team: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
  invoices: "M6 3h12v18l-3-2-3 2-3-2-3 2z M9 7h6 M9 11h6 M9 15h3",
  payouts: "M3 5h18v14H3z M3 9h18 M16 13h3",
  documents: "M5 3h9l5 5v13H5z M14 3v5h5 M8 12h8 M8 16h6",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2",
  support:
    "M5 14v-3a7 7 0 0 1 14 0v3 M5 11H3v7h4v-7z M19 11h2v7h-4v-7z M19 18v3h-7",
  external: "M7 17 17 7 M7 7h10v10",
  check: "m5 12 4 4 10-10",
  shield: "M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7z m-5 9 3 3 6-6",
  pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  clock: "M12 8v5l3 2 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
};
export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      className={"pro-icon " + className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.check} />
    </svg>
  );
}
