export type CategoryData = {
  _id: string
  title: string
  image?: string[]
  description?: string
  shortDescription?: string
  slug?: string
}

export type WorkshopImage = {
  image: string
  title: string
  _id: string
}

export type WorkshopSlot = {
  _id: string
  label: string
  startTime: string
  endTime: string
  capacity: number
}

export type WorkshopInclude = {
  _id: string
  title: string
}

export type WorkshopOption = {
  _id: string
  clayTypeId: string
  title: string
  price: number
  currency: string
  priceDescription: string
  description: string
  inclusions: any[]
  image: string
}

export type WorkshopItem = {
  _id: string
  title: string
  bannerImage: string

  images: WorkshopImage[]

  categoryId: CategoryData

  shortDescription: string
  description: string
  overview: string
  videoUrl?: string

  defaultSlots: WorkshopSlot[]

  includes: WorkshopInclude[]

  moreDetails: any[]
  nonAvailabilityDates: any[]
  nonAvailabilityDays: any[]

  options: WorkshopOption[]

  showOnHomepage: boolean
  isActive: boolean

  journeyImage: any[]

  createdAt: string
  slug: string
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in environment variables");
  }
}

export async function getWorkshopData(
  slug: string
): Promise<WorkshopItem> {
  assertApiBaseUrl();

  const res = await fetch(
    `${API_BASE_URL}/workshop/bySlug/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const raw = await res.json().catch(() => null);

  console.log("Workshop API:", raw,slug);

  if (!res.ok) {
    throw new Error(
      `Workshop data failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }

  return raw?.result;
}