import { TermItem } from "@/constants/faqData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in environment variables");
  }
}

export async function getTermsData(): Promise<TermItem[]> {
  assertApiBaseUrl();

  const res = await fetch(`${API_BASE_URL}/terms-and-conditions/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const raw = await res.json().catch(() => null);

  console.log("Terms data API:", raw);
  if (!res.ok) {
    throw new Error(
      `Terms data failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }


    return raw.result.termsAndConditions || [];
  

}