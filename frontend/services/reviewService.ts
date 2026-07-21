const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Define an interface based on your API response structure
export interface ReviewResponse {
  reviews: any[]; // Replace 'any' with your actual Review item type
  totalPages: number;
  currentPage: number;
}

export async function getReviewsData(page = 1, limit = 10): Promise<ReviewResponse> {
  // Resilient by design (build-time/ISR prerender): fall back to an empty
  // review set instead of throwing when the API is unreachable/errors.
  const fallback: ReviewResponse = { reviews: [], totalPages: 1, currentPage: page };

  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set; returning empty reviews.");
    return fallback;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/reviews/all?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(
        `Reviews data failed: ${res.status} ${res.statusText}${
          raw ? ` - ${JSON.stringify(raw)}` : ""
        }`
      );
      return fallback;
    }

    return {
      reviews: raw?.result?.googleReviews || [],
      totalPages: raw?.result?.totalPages || 1,
      currentPage: raw?.result?.currentPage || page,
    };
  } catch (err) {
    console.error("Reviews data fetch failed:", err);
    return fallback;
  }
}
