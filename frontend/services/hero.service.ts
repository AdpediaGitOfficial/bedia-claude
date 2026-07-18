import type { HeroSlide } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export interface OpeningHour {
  _id: string;
  title: string;
  days: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
}

export interface OpeningHoursResponse {
  totalCount: number;
  openingHours: OpeningHour[];
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  // Resilient by design (build-time/ISR prerender of the home page): fall back
  // to an empty list instead of throwing when the API is unreachable/errors.
  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set; returning empty hero slides.");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/workshop/homepage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(
        `Hero slides failed: ${res.status} ${res.statusText}${
          raw ? ` - ${JSON.stringify(raw)}` : ""
        }`
      );
      return [];
    }

    return Array.isArray(raw?.result) ? raw.result : [];
  } catch (err) {
    console.error("Hero slides fetch failed:", err);
    return [];
  }
}

export async function getOpeningHours(): Promise<OpeningHoursResponse> {
  const fallback: OpeningHoursResponse = { totalCount: 0, openingHours: [] };

  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set; returning empty opening hours.");
    return fallback;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/opening-hours/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(
        `Opening hours failed: ${res.status} ${res.statusText}${
          raw ? ` - ${JSON.stringify(raw)}` : ""
        }`
      );
      return fallback;
    }

    return raw?.result ?? fallback;
  } catch (err) {
    console.error("Opening hours fetch failed:", err);
    return fallback;
  }
}
