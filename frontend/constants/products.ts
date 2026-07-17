import { Product, Category } from '@/types'

export const categories: Category[] = [
  {
    id: '1',
    name: 'Adults Pottery Wheel',
    slug: 'adults-pottery-wheel',
    subtitle: '(Beginners workshop only)',
    description: 'A hands-on introduction to pottery wheel techniques, designed especially for beginners to learn, explore, and enjoy the process at a relaxed pace.',
  },
  {
    id: '2',
    name: 'Hand building',
    slug: 'hand-building',
    description: 'Learn the art of hand-building pottery using various techniques.',
  },
  {
    id: '3',
    name: 'Kids Pottery Wheel',
    slug: 'kids-pottery-wheel',
    description: 'Fun and engaging pottery workshops designed for children.',
  },
  {
    id: '4',
    name: 'Workshop',
    slug: 'workshop',
    description: 'Special pottery workshops and events.',
  },
  {
    id: '5',
    name: 'Packages',
    slug: 'packages',
    description: 'Special package deals for multiple sessions.',
  },
  {
    id: '6',
    name: 'Pottery Workshops',
    slug: 'pottery-workshops',
    description: 'General pottery workshops for all skill levels.',
  },
  {
    id: '7',
    name: "Dubai's Only Luxury Private",
    slug: 'luxury-private',
    description: 'Exclusive luxury private pottery experiences.',
  },
  {
    id: '8',
    name: 'Family Pottery Workshop',
    slug: 'family-pottery-workshop',
    description: 'Family-friendly pottery workshops for all ages.',
  },
]

export const product = {
  _id: "6a0b15ca645dc00dea1e3977",

  title: "Team Building",

  slug: "team-building",

  bannerImage: "",

  images: [
    {
      image:
        "https://api-bediaprive.adpedia.in/uploads/1779111370376-team2.jpg",
      title: "",
      _id: "6a10449e645dc00dea1e3d50",
    },
  ],

  categoryId: {
    _id: "6a0b11fc645dc00dea1e38fc",
    title: "Adults Workshop",
  },

  shortDescription:
    "Boost team spirit and bond through clay in our Pottery Team-Building Workshop at Bedia Pottery Studio",

  description:
    "Create lasting memories and stronger connections using ceramic or air-dry clay in a fun, creative setting",

  overview:
    "Looking for a creative way to boost collaboration and build team spirit? Our Pottery Team-Building Workshop invites your group to slow down, connect, and craft something together. No experience needed — just bring your team and enjoy 1.5 hours of fun, hands-on clay time with the option to return for a painting session.",

  defaultSlots: [
    {
      _id: "6a10449e645dc00dea1e3d4b",
      label: "slot 1",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      capacity: 12,
    },
    {
      _id: "6a10449e645dc00dea1e3d4c",
      label: "slot 2",
      startTime: "4:00 PM",
      endTime: "5:30 PM",
      capacity: 12,
    },
  ],

  includes: [
    {
      title: "2 Hours for the Event",
      _id: "6a10449e645dc00dea1e3d51",
    },
    {
      title: "Dedicated Workshop Area 1200 sq ft",
      _id: "6a10449e645dc00dea1e3d52",
    },
    {
      title: "Expert Instructors",
      _id: "6a10449e645dc00dea1e3d53",
    },
  ],

  options: [
    {
      _id: "6a10449e645dc00dea1e3d4d",
      clayTypeId: "698ed9075bed39f35db8991a",
      title: "Air-Dry Clay",
      price: 249,
      currency: "AED",
      priceDescription: "per person",
      description: "Air-Dry Clay",
      inclusions: [],
      image: "",
    },
    {
      _id: "6a10449e645dc00dea1e3d4e",
      clayTypeId: "698ed9075bed39f35db8991c",
      title: "Terracotta Clay",
      price: 259,
      currency: "AED",
      priceDescription: "person",
      description: "Terracotta Clay",
      inclusions: [],
      image: "",
    },
    {
      _id: "6a10449e645dc00dea1e3d4f",
      clayTypeId: "698ed9075bed39f35db8991b",
      title: "Ceramic Clay",
      price: 299,
      currency: "AED",
      priceDescription: "person",
      description: "Ceramic Clay",
      inclusions: [],
      image: "",
    },
  ],

  showOnHomepage: true,

  isActive: true,

  journeyImage: [],

  moreDetails: [],

  nonAvailabilityDates: [],

  nonAvailabilityDays: [],

  createdAt: "2026-05-18T13:36:10.489Z",
};