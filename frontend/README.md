# Bedia Pottery - Premium Ceramic Studio

A modern, responsive Next.js website for Bedia Pottery, a premium ceramic studio offering pottery classes and workshops.

## Features

- 🎨 Modern, clean UI with dark green and white theme
- 📱 Fully responsive design
- ⚡ Built with Next.js 14, TypeScript, and Tailwind CSS
- 🏗️ Component-based architecture following SOLID principles
- 🎯 SEO optimized with proper metadata

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Architecture:** Component-based with SOLID principles

## Project Structure

```
bedia-pottery/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Navigation header
│   │   └── Footer.tsx      # Footer component
│   ├── sections/
│   │   ├── HeroSection.tsx      # Hero carousel
│   │   ├── ContentGrid.tsx      # Content grid with CTA
│   │   └── TestimonialsSection.tsx  # Testimonials
│   └── ui/
│       ├── Logo.tsx        # Logo component
│       ├── Button.tsx      # Reusable button
│       └── IconButton.tsx  # Icon button component
├── constants/
│   └── data.ts            # Data constants (separated from components)
├── types/
│   └── index.ts           # TypeScript type definitions
└── public/
    └── images/            # Image assets (to be added)
```

## SOLID Principles Implementation

1. **Single Responsibility:** Each component has one clear purpose
   - `Header` handles navigation
   - `HeroSection` manages hero carousel
   - `TestimonialsSection` displays testimonials
   - UI components are reusable and focused

2. **Open/Closed:** Components are extensible through props
   - `Button` accepts variant props for different styles
   - `Logo` supports different variants (default/white)
   - Components can be extended without modification

3. **Liskov Substitution:** Components are substitutable
   - All UI components follow consistent interfaces
   - Can be swapped with alternative implementations

4. **Interface Segregation:** TypeScript interfaces are specific
   - Separate interfaces for different data types
   - Components only depend on what they need

5. **Dependency Inversion:** Depend on abstractions
   - Data separated into constants file
   - Components depend on types/interfaces, not concrete data

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add images to `public/images/` directory:
   - `hero-1.jpg`, `hero-2.jpg` - Hero section images
   - `adults-workshop.jpg` - Adults workshop image
   - `kids-workshop.jpg` - Kids workshop image
   - `family-workshop.jpg` - Family workshop image
   - `testimonial-rahul.jpg` - Testimonial profile image
   - `testimonial-ayesha.jpg` - Testimonial profile image
   - `testimonial-sarah.jpg` - Testimonial profile image

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Theme Configuration

The theme uses a dark green (`#1a4d3a`) and white color scheme, configured in `tailwind.config.ts`:

- Primary: Dark green (`#1a4d3a`)
- Secondary: White
- Custom utilities in `globals.css` for consistent styling

## Customization

- **Colors:** Edit `tailwind.config.ts` to change the color scheme
- **Content:** Update `constants/data.ts` to modify page content
- **Components:** All components are modular and can be easily customized

## Build for Production

```bash
npm run build
npm start
```

## License

© 2024 Bedia Pottery LLC
