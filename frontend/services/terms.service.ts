import { TermItem } from "@/constants/faqData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function getTermsData(): Promise<TermItem[]> {
  // Resilient by design (build-time/ISR prerender): fall back to an empty list
  // instead of throwing when the API is unreachable or errors.
  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set; returning empty terms list.");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/terms-and-conditions/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(
        `Terms data failed: ${res.status} ${res.statusText}${
          raw ? ` - ${JSON.stringify(raw)}` : ""
        }`
      );
      return [];
    }

    return raw?.result?.termsAndConditions || [];
  } catch (err) {
    console.error("Terms data fetch failed:", err);
    return [];
  }
}
