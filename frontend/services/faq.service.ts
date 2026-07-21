import { FAQItem } from "@/constants/faqData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function getFaqData(): Promise<FAQItem[]> {
  // Resilient by design: this runs during `next build` (static/ISR prerender).
  // If the API is unreachable or errors, return an empty list instead of
  // throwing so the build never hard-fails; ISR revalidation self-heals once
  // the API is reachable.
  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set; returning empty FAQ list.");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/faq/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(
        `FAQ data failed: ${res.status} ${res.statusText}${
          raw ? ` - ${JSON.stringify(raw)}` : ""
        }`
      );
      return [];
    }

    return raw?.result?.faqs || [];
  } catch (err) {
    console.error("FAQ data fetch failed:", err);
    return [];
  }
}
