
import GiftPageClient from '@/components/giftcard/GiftPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Cards',
  description: 'Give the gift of pottery. Purchase a Bedia Pottery gift card for your loved ones.',
}

const GiftCardsPage = async () => {
  
  return (
      <main>
                <GiftPageClient/>
        </main>

  )
}

export default GiftCardsPage
