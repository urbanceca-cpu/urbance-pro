export const POLICY_VERSION = "2026-10-21";
export const COMMISSION_RATE = 0.07;
export const CATEGORIES = [
  "cleaning",
  "handyman",
  "moving",
  "junk",
  "painting",
  "plumbing",
  "electrical",
  "landscaping",
  "appliance",
] as const;
export const CITIES: Record<string, [number, number]> = {
  Vancouver: [49.2827, -123.1207],
  Burnaby: [49.2488, -122.9805],
  Surrey: [49.1913, -122.849],
  Richmond: [49.1666, -123.1336],
  Coquitlam: [49.2838, -122.7932],
  Delta: [49.0847, -123.0586],
  Langley: [49.1044, -122.6608],
  "North Vancouver": [49.32, -123.0736],
  "West Vancouver": [49.3286, -123.1602],
  "New Westminster": [49.2057, -122.911],
  "Port Coquitlam": [49.262, -122.7811],
  "Port Moody": [49.2849, -122.8672],
  "Maple Ridge": [49.2193, -122.5984],
  "Pitt Meadows": [49.219, -122.69],
  "White Rock": [49.0253, -122.8029],
};
export const PERMISSIONS = [
  "jobs.view",
  "jobs.accept",
  "jobs.assign",
  "jobs.work",
  "team.manage",
  "team.track",
  "billing.manage",
  "settings.manage",
  "documents.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];
export const ROLES: Record<string, readonly Permission[]> = {
  owner: PERMISSIONS,
  manager: [
    "jobs.view",
    "jobs.accept",
    "jobs.assign",
    "jobs.work",
    "team.track",
    "documents.manage",
  ],
  dispatcher: ["jobs.view", "jobs.accept", "jobs.assign", "team.track"],
  technician: ["jobs.work"],
  billing: ["billing.manage"],
  viewer: ["jobs.view"],
};
export function permissionsFor(role: string, grants: unknown): Permission[] {
  const allowed = ROLES[role] || [];
  if (role === "owner") return [...PERMISSIONS];
  return Array.isArray(grants)
    ? allowed.filter((p) => grants.includes(p))
    : [...allowed];
}
export function normalizeCategory(value: string) {
  const s = value.toLowerCase();
  if (/clean/.test(s)) return "cleaning";
  if (/mov/.test(s)) return "moving";
  if (/junk|haul/.test(s)) return "junk";
  // A named trade takes precedence over generic words such as "repair".
  const trade = CATEGORIES.find((c) => s.includes(c));
  if (trade) return trade;
  if (/repair|mount|assembl|handyman/.test(s)) return "handyman";
  return s;
}
export function distanceKm(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180;
  const dlat = (b[0] - a[0]) * r,
    dlon = (b[1] - a[1]) * r;
  const x =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dlon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
export function eligible(
  provider: {
    city: string;
    categories: string[];
    online: boolean;
    last_seen_at: string | null;
    max_travel_km: number;
    approved: boolean;
    is_demo?: boolean;
  },
  job: {
    city: string;
    category: string;
    created_at: string;
    is_demo?: boolean;
  },
  expanded: boolean,
  now = Date.now(),
) {
  const seen = Date.parse(provider.last_seen_at || "");
  if (
    !provider.approved ||
    !provider.online ||
    !provider.last_seen_at ||
    !Number.isFinite(seen) ||
    seen > now + 60 * 1000 ||
    now - seen > 10 * 60 * 1000 ||
    !!provider.is_demo !== !!job.is_demo
  )
    return false;
  if (
    !provider.categories
      .map(normalizeCategory)
      .includes(normalizeCategory(job.category))
  )
    return false;
  if (provider.city.toLowerCase() === job.city.toLowerCase()) return true;
  if (!expanded) return false;
  const a = CITIES[provider.city],
    b = CITIES[job.city];
  return !!a && !!b && distanceKm(a, b) <= provider.max_travel_km;
}
export const TRANSITIONS: Record<string, string[]> = {
  accepted: ["en_route"],
  en_route: ["arrived"],
  arrived: ["in_progress"],
  in_progress: ["completed"],
};
export function canTransition(from: string, to: string, phases: string[]) {
  return (
    !!TRANSITIONS[from]?.includes(to) &&
    (to !== "in_progress" || phases.includes("before")) &&
    (to !== "completed" ||
      ["before", "during", "after"].every((p) => phases.includes(p)))
  );
}
export function calculateInvoice(
  items: { description: string; quantity: number; unit_cents: number }[],
  gstNumber: string,
  gstRate: number,
) {
  if (
    !items.length ||
    items.length > 50 ||
    items.some(
      (i) =>
        !i.description.trim() ||
        !Number.isFinite(i.quantity) ||
        i.quantity <= 0 ||
        i.quantity > 10000 ||
        !Number.isSafeInteger(i.unit_cents) ||
        i.unit_cents < 0,
    )
  )
    throw Error("Enter valid invoice items.");
  if (gstRate !== 0 && gstRate !== 0.05)
    throw Error("Choose zero tax or 5% GST for this BC invoice.");
  if (gstRate && !/^\d{9}RT\d{4}$/i.test(gstNumber.replace(/\s/g, "")))
    throw Error(
      "A valid GST registration number is required before charging GST.",
    );
  const subtotal = items.reduce(
    (s, i) => s + Math.round(i.quantity * i.unit_cents),
    0,
  );
  if (!Number.isSafeInteger(subtotal) || subtotal > 100000000)
    throw Error("Invoice total is too large.");
  const tax = Math.round(subtotal * gstRate);
  return {
    subtotal_cents: subtotal,
    tax_cents: tax,
    total_cents: subtotal + tax,
  };
}
export function validateApplication(
  input: Record<string, unknown>,
  kinds: string[],
) {
  const required = [
    "legal_name",
    "phone",
    "address",
    "city",
    "postal_code",
    "business_type",
    "worksafe_status",
    "insurance_expiry",
  ];
  for (const key of required)
    if (!String(input[key] || "").trim())
      throw Error("Complete " + key.replaceAll("_", " ") + ".");
  if (!Object.keys(CITIES).includes(String(input.city)))
    throw Error("Choose a supported Metro Vancouver city.");
  if (
    !/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
      String(input.postal_code),
    )
  )
    throw Error("Enter a Canadian postal code.");
  if (String(input.phone).replace(/\D/g, "").length < 10)
    throw Error("Enter a Canadian phone number.");
  if (!["individual", "team"].includes(String(input.business_type)))
    throw Error("Select individual or team.");
  if (
    !Array.isArray(input.categories) ||
    !input.categories.length ||
    input.categories.some(
      (c) => !CATEGORIES.includes(c as (typeof CATEGORIES)[number]),
    )
  )
    throw Error("Choose your services.");
  if (!Number.isFinite(Number(input.insurance_limit)) || Number(input.insurance_limit) < 2000000)
    throw Error("Urbance requires at least CAD $2 million liability coverage.");
  if (
    Date.parse(String(input.insurance_expiry)) <= Date.now() ||
    !Number.isFinite(Date.parse(String(input.insurance_expiry)))
  )
    throw Error("Insurance must be current.");
  if (
    !["registered", "not_required_review"].includes(
      String(input.worksafe_status),
    )
  )
    throw Error("Declare your WorkSafeBC status.");
  if (
    !kinds.includes("government_id") ||
    !kinds.includes("liability_insurance") ||
    !kinds.includes("background_check")
  )
    throw Error(
      "Upload ID, liability insurance and a background-check document.",
    );
  if (
    input.worksafe_status === "not_required_review" &&
    !String(input.notes || "").trim()
  )
    throw Error(
      "Explain why WorkSafeBC registration may not be required so our team can review it.",
    );
  if (
    input.worksafe_status === "registered" &&
    !kinds.includes("worksafe_clearance")
  )
    throw Error("Upload your WorkSafeBC clearance letter.");
  if (
    (input.categories as string[]).some((c) =>
      ["electrical", "plumbing"].includes(c),
    ) &&
    (!input.licence_number || !kinds.includes("trade_licence"))
  )
    throw Error("Upload the relevant trade credentials and licence number.");
  if (
    input.authorized_to_work !== true ||
    input.accuracy_accepted !== true ||
    input.terms_accepted !== true ||
    input.privacy_accepted !== true ||
    input.contractor_accepted !== true ||
    input.safety_accepted !== true
  )
    throw Error("Review and accept each required declaration and agreement.");
}
