const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set in environment variables"
    );
  }
}

export interface GiftValidationResponse {
  success: boolean;
  result: any; // Replace `any` with your actual response type
}

export interface GiftRedeemConfirmPayload {
  bookingId: string;
  voucherCode: string;
  bookingDate: string;
  slotId: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
}

export interface GiftRedeemConfirmResponse {
  success: boolean;
  message?: string;
  result?: any;
}

/**
 * Validates the gift data based on bookingId
 */
export async function validateGiftData(
  bookingId: string
): Promise<GiftValidationResponse["result"]> {
  assertApiBaseUrl();

  const res = await fetch(
    `${API_BASE_URL}/workshop/redeem/validate/${bookingId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fetch latest validation
    }
  );

  const raw = await res.json().catch(() => null);

  console.log("Gift validation API:", raw);

  if (!res.ok) {
    throw new Error(
      `Gift validation failed: ${res.status} ${res.statusText}${
        raw ? ` - ${JSON.stringify(raw)}` : ""
      }`
    );
  }

  return raw?.result;
}

/**
 * Confirms and executes the coupon/voucher redemption
 */
export async function confirmGiftRedeem(
  payload: GiftRedeemConfirmPayload,
  token?: string
): Promise<GiftRedeemConfirmResponse> {
  assertApiBaseUrl();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/workshop/redeem/confirm`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await res.json().catch(() => null);

  console.log("Gift redemption confirmation API:", raw);

  if (!res.ok) {
    throw new Error(
      raw?.message || `Redemption failed with status: ${res.status}`
    );
  }

  return raw;
}