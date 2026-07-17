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
function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in environment variables");
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  assertApiBaseUrl();

  const res = await fetch(`${API_BASE_URL}/workshop/homepage`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const raw = await res.json().catch(() => null);

  console.log("Hero slides APIv:", raw);
  if (!res.ok) {
    throw new Error(
      `Hero slides failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }



  if (Array.isArray(raw?.result)) {
    return raw.result;
  }


  return [];
}
export async function getOpeningHours(): Promise<OpeningHoursResponse> {
  assertApiBaseUrl();

  const res = await fetch(`${API_BASE_URL}/opening-hours/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const raw = await res.json().catch(() => null);

  console.log("Opening Hours API:", raw);

  if (!res.ok) {
    throw new Error(
      `Opening hours failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }

  return raw.result;
}