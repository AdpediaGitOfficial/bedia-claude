import HeroSection from '@/components/sections/HeroSection'
import FeatureScroller from '@/components/sections/FeatureScroller'
import TestimonialsSection from '@/components/testimonial/TestimonialsSection'
import { getHeroSlides } from '@/services/hero.service'
import LocationSection from '@/components/common/LocationSection'

// Incrementally regenerate this page (ISR) so it survives an API outage at
// build time and refreshes with live data once the API is reachable.
export const revalidate = 300

export default async function Home() {
  const heroSlides = await getHeroSlides()

  return (
    <main className="min-h-screen">
      <HeroSection slides={heroSlides} />
      <FeatureScroller />
      <TestimonialsSection />
      <LocationSection/>
    </main>
  )
}
