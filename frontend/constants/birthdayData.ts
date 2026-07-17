// Constants for Birthday Party Package
export interface BirthdayPackage {
  id: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  capacity: string
  duration: string
  ageGroup: string
  includes: string[]
}

export interface EventStep {
  id: string
  number: number
  title: string
  description: string
  duration: string
  icon?: string
}

export interface ParentNote {
  id: string
  title: string
  content: string
  icon?: string
}

export interface PricingTier {
  id: string
  title: string
  price: number
  description: string
  features: string[]
}

export const birthdayPackages: BirthdayPackage[] = [
  {
    id: 'standard',
    name: 'Birthday Party Package',
    description: 'A delightful pottery experience for birthday celebrations',
    image: '/images/product/1.png',
    price: 350,
    originalPrice: 400,
    capacity: '6-12 Kids',
    duration: '2 Hours',
    ageGroup: '5-15 Years',
    includes: [
      'Welcome & Introduction to Pottery',
      'Hands-on Pottery Creation',
      'Paint & Decorate Your Piece',
      'Certificate of Participation',
      'Birthday Badge & Memory Book Entry',
    ],
  },
]

export const eventTimeline: EventStep[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Welcome & Introduction',
    description: 'Kids meet the pottery instructor and learn about clay',
    duration: '15 mins',
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Pottery Creation',
    description: 'Each child creates their own unique pottery piece',
    duration: '45 mins',
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Paint & Decorate',
    description: 'Creative painting and decorating session',
    duration: '30 mins',
  },
  {
    id: 'step-4',
    number: 4,
    title: 'Celebration & Cake',
    description: 'Party time with cake and refreshments',
    duration: '30 mins',
  },
]

export const parentNotes: ParentNote[] = [
  {
    id: 'note-1',
    title: 'What to Bring',
    content:
      'Please bring birthday cake, drinks, and decorations. The studio provides a clean workspace and all pottery supplies.',
  },
  {
    id: 'note-2',
    title: 'Dress Code',
    content:
      'Don\'t worry about clay stains! Wear old clothes or bring an apron. We provide protective gear as well.',
  },
  {
    id: 'note-3',
    title: 'Piece Collection',
    content:
      'Pottery pieces take 6-8 weeks to be fired. They can be picked up or shipped to your address.',
  },
]

export const pricingTiers: PricingTier[] = [
  {
    id: 'tier-1',
    title: 'Birthday Party Package',
    price: 350,
    description: 'Perfect for 6-12 kids',
    features: [
      '2-hour party duration',
      'All pottery supplies included',
      'Professional instructor',
      'Piece firing included',
      'Certificate for each child',
    ],
  },
  {
    id: 'tier-2',
    title: 'Premium Package',
    price: 500,
    description: 'For larger groups (12-20 kids)',
    features: [
      '3-hour party duration',
      'Advanced pottery techniques',
      'Photography service included',
      'Premium gift box per child',
      'Custom party decorations',
    ],
  },
]
