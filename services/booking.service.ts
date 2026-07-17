import { useAuthStore } from '@/store/authStore'
import { BookingData, CheckoutPayload } from '@/types'
/**
 * BookingService
 * Single Responsibility: Handle booking API logic
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || ''

function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not set in environment variables'
    )
  }
}

export interface IBookingService {
  addToCart(data: BookingData): Promise<any>
  bookNow(data: CheckoutPayload): Promise<any>
}

export class BookingService
  implements IBookingService
{

  async addToCart(
    data: BookingData
  ): Promise<any> {
    assertApiBaseUrl()
const token : string | null = useAuthStore.getState().user?.token || null

    const res = await fetch(
      `${API_BASE_URL}/workshop/cart`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )

    const raw = await res
      .json()
      .catch(() => null)

    console.log('Add to cart API:', raw)

    if (!res.ok || raw?.success === false || raw?.msuccess === false) {
      throw new Error(
        raw?.message || raw?.error ||
          `Add to cart failed: ${res.status} ${res.statusText}${
            raw ? ` - ${JSON.stringify(raw)}` : ''
          }`
      )
    }

    return raw
  }

  async bookNow(
    data: CheckoutPayload
  ): Promise<any> {
    assertApiBaseUrl()

    const token : string | null = useAuthStore.getState().user?.token || null

    const res = await fetch(
      `${API_BASE_URL}/workshop/cart/checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )

    const raw = await res
      .json()
      .catch(() => null)

    console.log('Book now API:', raw)

    if (!res.ok || raw?.success === false || raw?.msuccess === false) {
      throw new Error(
        raw?.message || raw?.error ||
          `Booking failed: ${res.status} ${res.statusText}${
            raw ? ` - ${JSON.stringify(raw)}` : ''
          }`
      )
    }

    if (raw.checkoutUrl) {
      window.location.href = raw.checkoutUrl
    }

    return raw
  }
}