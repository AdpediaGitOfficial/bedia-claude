const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in environment variables");
  }
}

// Define an interface based on your API response structure
export interface ReviewResponse {
  reviews: any[]; // Replace 'any' with your actual Review item type
  totalPages: number;
  currentPage: number;
}

export async function getReviewsData(page = 1, limit = 10): Promise<ReviewResponse> {
  assertApiBaseUrl();

  const res = await fetch(`${API_BASE_URL}/reviews/all?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const raw = await res.json().catch(() => null);

  console.log(`Reviews data API (Page ${page}):`, raw);
  
  if (!res.ok) {
    throw new Error(
      `Reviews data failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }

  // Adjust this return statement to match your actual API response payload structure
  return {
    reviews: raw?.result?.googleReviews || [],
    totalPages: raw?.result?.totalPages || 1,
    currentPage: raw?.result?.currentPage || page
  };
}