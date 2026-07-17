import {
  NavigationItem,
  HeroSlide,
  ContentCard,
  Testimonial,
  FooterLink,
  SocialMedia,
  GoogleReview,
} from "@/types";
export const navigationItems: NavigationItem[] = [
  {
    label: "Pottery Workshops",
    href: "/workshops",
    children: [
      { label: "Adults Workshop", href: "/workshops/adults-workshop" },
      { label: "Kids Workshop", href: "/workshops/kids-workshop" },
      { label: "Family Pottery Workshop", href: "/workshops/family-pottery-workshop" },
      { label: "Kids Birthday Party", href: "/workshops/kids-birthday-party" },
      { label: "Adults Birthday Party", href: "/workshops/adults-birthday-party" },
      { label: "Gift Cards", href: "/workshops/gift-cards" },
      // { label: "School Field Trips", href: "/workshops/school-field-trips" },
    ],
  },
  // { label: "Birthday Parties", href: "/birthday" },
 { 
  label: "Bedia Privé", 
  href: "https://bediaprive.com", 
  target: "_blank" 
}
];

export const contentCards: ContentCard[] = [
  {
    id: "1",
    type: "imagecard",
    imageUrl: "/images/banner/banner-2.png",
    title: "Family",
    subtitle: "Family Pottery Workshop",
    description: "Relax, create, and unwind through mindful pottery.",
    ctaText: "Explore Now →",
    ctaLink: "/classes/adults",
  },
  {
    id: "2",
    type: "imagecard",
    imageUrl: "/images/banner/banner-3.png",
    title: "Adults",
    subtitle: "Adult Pottery Classes",
    description: "Relax, create, and unwind through mindful pottery.",
    ctaText: "Explore Now ",
    ctaLink: "/classes/adults",
  },
  {
    id: "3",
    type: "imagecard",
    imageUrl: "/images/banner/banner-4.png",
    title: "Kids",
    subtitle: "Kids Pottery Wheel",
    description: "Relax, create, and unwind through mindful pottery.",
    ctaText: "Explore Now ",
    ctaLink: "/classes/adults",
  },
  {
    id: "4",
    type: "cta",
    title: "Adults",
    subtitle: "Adult Pottery Classes",
    description: "Relax, create, and unwind through mindful pottery.",
    ctaText: "Explore Now ",
    ctaLink: "/classes/adults",
  },
];

export const testimonials: GoogleReview[] = [
  {
    _id: "6971d1f5d1ee9efa7f2ec132",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    authorName: "Vikram Singh",
    rating: 3,
    text: "Good bad experience. Would recommend at all.",
    profilePhotoUrl: "https://lh3.googleusercontent.com/a-/AOh14GgVikram",
    reviewTime: 1706409200,
    media: {
      videos: ["https://youtube.com/review-videos/test-1.mp4"],
      images: [],
    },
    source: "google",
    isActive: true,
  },
  {
    _id: "6971d1f5d1ee9efa7f2ec131",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    authorName: "Sneha Iyer",
    rating: 3,
    text: "Satisfied. Good improvement.",
    profilePhotoUrl: "https://lh3.googleusercontent.com/a-/AOh14GgSneha",
    reviewTime: 1706322800,
    media: {
      videos: ["https://yourcdn.com/videos1/rahul-1.mp4"],
      images: [],
    },
    source: "manual",
    isActive: true,
  },
  {
    _id: "6971d1f5d1ee9efa7f2ec130",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    authorName: "Rahul Verma",
    rating: 3,
    text: "Average experience.",
    profilePhotoUrl: "https://lh3.googleusercontent.com/a-/AOh14GgRahul",
    reviewTime: 1706236400,
    isActive: true,
  },
  {
    _id: "6971d1f5d1ee9efa7f2ec12f",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    authorName: "Priya Nair",
    rating: 4,
    text: "Nice ambience and good experience overall. Parking could be better.",
    profilePhotoUrl: "https://lh3.googleusercontent.com/a-/AOh14GgPriya",
    reviewTime: 1706150000,
  },
  {
    _id: "6971d1f5d1ee9efa7f2ec12e",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    authorName: "Amit Sharma",
    rating: 5,
    text: "Excellent service! The staff was very polite and helpful. Highly recommended.",
    profilePhotoUrl: "https://lh3.googleusercontent.com/a-/AOh14GgAmit",
    reviewTime: 1706073600,
    media: {
      videos: ["https://yourcdn.com/review-videos/rahul-1.mp4"],
      images: [],
    },
    source: "google",
    isActive: true,
  },
]


export const footerLinks: FooterLink[] = [
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Faq", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const socialMedia: SocialMedia[] = [
  {
    name: "Facebook",
    icon: "/images/icons/fb.svg",
    href: "https://facebook.com",
  },
  {
    name: "Instagram",
    icon: "/images/icons/insta.svg",
    href: "https://instagram.com",
  },
  {
    name: "TikTok",
    icon: "/images/icons/tiktok.svg",
    href: "https://tiktok.com",
  },
  {
    name: "Snapchat",
    icon: "/images/icons/snapchat.svg",
    href: "https://snapchat.com",
  },
];

export const openingHours = {
  weekdays: {
    days: "Monday - Saturday",
    hours: "10.30 - 7.30",
  },
  sunday: {
    days: "Sunday",
    hours: "10.30 - 7.30",
  },
};

// export const heroSlides = [
//   {
//     id: 1,
//     layout: "default",
//     imageUrl: "/images/banner/banner-1.png",
//     title: "Curated for Those Who Find Beauty in Process",
//     subtitle: "Pottery Classes",
//     description: "Slow, guided sessions designed to help you learn, create, and enjoy every stage of working with clay.",
//     cards:contentCards
//   },

//   {
//     id: 2,
//     layout: "featured",
//     imageUrl: "/images/banner/banner-2.png",
//     title: "Crafted for Those Who Value Time and Beauty",
//     subtitle: "Bedia Privé",
//     description: "A private clay experience designed for unhurried moments, beautiful details, and quiet indulgence.",
//        cards: [
//       { id: 1, type: "image", imageUrl: "/images/banner/banner-6.png" },
//       { id: 2, type: "image", imageUrl: "/images/banner/banner-7.png" },
//       { id: 3, type: "image", imageUrl: "/images/banner/banner-8.png" },
//       {
//         id: 4,
//         type: "cta",
//     title: "Bedia Privé",
//         subtitle: "Explore the Experience",
//         description: "A refined journey of clay, calm, and creativity.",
//         ctaText: "Explore Now",
//         ctaLink: "/experience",
//       },
//     ],
//   },
// ]
// export const heroSlides =  [
//     {
//       _id: "69857e324c538d1184db661f",
//       cards: [
//         {
//           _id: "6985925a229aba3efc281e14",
//           title: "Slabing Technique",
//           bannerImage: "/images/banner/banner-3.png",
//           images: [
//             "/images/banner/banner-3.png"
//           ],
//           shortDescription: "short"
//         },
//         {
//           _id: "69897bd28f9be9dba2c34fb8",
//           title: "Handbuilding",
//           bannerImage: "/images/banner/banner-4.png",
//           images: [
//             "/images/banner/banner-4.png"
//           ],
//           shortDescription: "Get pumped for our “Craft Your Vibe” handbuilding workshop at Bedia Pottery Studio"
//         },
//         {
//           _id: "69897cab8f9be9dba2c34fc1",
//           title: "Coiling Technique",
//           bannerImage: "/images/banner/banner-5.png",
//           images: [
//             "/images/banner/banner-5.png"
//           ],
//           shortDescription: "Our “Coil & Create” workshop at Bedia Pottery Studio is perfect for both kids and adults "
//         },

//       ],
//       layout: "featured",
//       imageUrl: "/images/banner/banner-1.png",
//       title: "Pottery classes",
//       description: "It's a place to slow down, breathe deep, and let your hands do the thinking.",
//       shortDescription: "Curated for Those Who Find Beauty in Process...."
//     },
//     {
//       _id: "6989a0e9a1ac69543c516863",
//       cards: [
//         {
//           _id: "6989a1d6a1ac69543c51686c",
//           title: "Pottery Experience",
//           bannerImage: "/images/banner/banner-6.png",
//           images: [
//             "/images/banner/banner-6.png"
//           ],
//           shortDescription: "he World’s First Luxury Clay & Dine​"
//         },
//         {
//           _id: "6989a48bfa961105aa20b00c",
//           title: "Dining with Pottery",
//           bannerImage: "/images/banner/banner-7.png",
//           images: [
//             "/images/banner/banner-7.png"
//           ],
//           shortDescription: "Bedia, we don’t just create pottery. We create moments, and this one is yours to keep."
//         },
//         {
//           _id: "6989a547fa961105aa20b022",
//           title: "Experience pottery with dining",
//           bannerImage: "/images/banner/banner-8.png",
//           images: [
//             "/images/banner/banner-8.png"
//           ],
//           shortDescription: "we don’t just create pottery. We create moments, and this one is yours to keep."
//         }
//       ],
//       layout: "featured",
//       imageUrl: "/images/banner/banner-2.png",
//       title: "Bedia Prive",
//       description: "A private clay experience designed for unhurried memories  ",
//       shortDescription: "Curated for Those Who Find Beauty in Process"
//     }
//   ]
export const heroSlides = [
  {
    _id: "69857e324c538d1184db661f",
    cards: [
      {
        _id: "6985925a229aba3efc281e14",
        title: "Slabing Technique",
        bannerImage: "/images/banner/banner-3.png",
        images: ["http://localhost:8000/uploads/1770361434405-pottery1.jpg"],
        shortDescription: "short",
        slug: "coiling-technique",
        type: "Kids",
      },
      {
        _id: "69897cab8f9be9dba2c34fc1",
        title: "Coiling Technique",
        bannerImage: "/images/banner/banner-4.png",
        images: ["/images/banner/banner-4.png"],
        shortDescription:
          "Our “Coil & Create” workshop at Bedia Pottery Studio is perfect for both kids and adults ",
        slug: "coiling-technique-1",
        type: "Adults",
      },
      {
        _id: "69897fe28f9be9dba2c34ff4",
        title: "Family Pottery workshops",
        bannerImage: "/images/banner/banner-5.png",
        images: ["/images/banner/banner-5.png"],
        shortDescription:
          "Ranging from beginner to advanced levels, these sessions cover essential techniques like hand-building ",
        slug: "family-pottery-workshops",
        type: "Family",
      },
      {
        id: "4",
        type: "cta",
        title: "Adults",
        subtitle: "Adult Pottery Classes",
        description: "Relax, create, and unwind through mindful pottery.",
        ctaText: "Explore Now ",
        ctaLink: "/classes/adults",
      },
    ],
    layout: "featured",
    imageUrl: "/images/banner/banner-1.png",
    title: "Pottery classes",
    description:
      "It's a place to slow down, breathe deep, and let your hands do the thinking.",
    shortDescription: "Curated for Those Who Find Beauty in Process....",
  },
  {
    _id: "6989a0e9a1ac69543c516863",
    cards: [
      {
        _id: "6989a1d6a1ac69543c51686c",
        title: "Pottery Experience",
        bannerImage: "/images/banner/banner-6.png",
        images: ["/images/banner/banner-6.png"],
        shortDescription: "he World’s First Luxury Clay & Dine​",
        slug: "pottery-experience",
        type: "Kids",
      },
      {
        _id: "6989a48bfa961105aa20b00c",
        title: "Dining with Pottery",
        bannerImage: "/images/banner/banner-7.png",
        images: ["/images/banner/banner-7.png"],
        shortDescription:
          "Bedia, we don’t just create pottery. We create moments, and this one is yours to keep.",
        slug: "dining",
      },
      {
        _id: "6989a547fa961105aa20b022",
        title: "Experience pottery with dining",
        bannerImage: "/images/banner/banner-8.png",
        images: ["/images/banner/banner-8.png"],
        shortDescription:
          "we don’t just create pottery. We create moments, and this one is yours to keep.",
        slug: "experience-pottery-with-dining",
      },
      {
        id: 4,
        type: "cta",
        title: "Bedia Privé",
        subtitle: "Explore the Experience",
        description: "A refined journey of clay, calm, and creativity.",
        ctaText: "Explore Now",
        ctaLink: "/experience",
      },
    ],
    layout: "featured",
    imageUrl: "/images/banner/banner-2.png",
    title: "Bedia Prive",
    description: "A private clay experience designed for unhurried memories  ",
    shortDescription: "Curated for Those Who Find Beauty in Process",
  },
];
