import HeroSection from '@/components/sections/HeroSection'
import FeatureScroller from '@/components/sections/FeatureScroller'
import TestimonialsSection from '@/components/testimonial/TestimonialsSection'
import { getHeroSlides } from '@/services/hero.service'
import LocationSection from '@/components/common/LocationSection'

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
