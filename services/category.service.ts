export type CategoryData = {
  _id: string;
  title: string;
  image: string[];
  description: string;
  shortDescription: string;
  slug: string;
};

export type WorkshopItem = {
  _id: string;
  title: string;
  bannerImage: string;
  images: {
    image: string;
    title: string;
    _id: string;
  }[];
  shortDescription: string;
  includes: any[];
  journeyImage: any[];
  moreDetails: any[];
  slug: string;
};

export type CategoryResponse = {
  totalCount: number;
  category: CategoryData;
  workshops: WorkshopItem[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in environment variables");
  }
}

export async function getCategoryData(
  slug: string
): Promise<CategoryResponse> {
  assertApiBaseUrl();

  const res = await fetch(
    `${API_BASE_URL}/workshop/byCategory?slug=${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const raw = await res.json().catch(() => null);

  console.log("Category API:", raw, `${API_BASE_URL}/workshop/byCategory?slug=${slug}`);

  if (!res.ok) {
    throw new Error(
      `Category data failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }

  return raw?.result;
}