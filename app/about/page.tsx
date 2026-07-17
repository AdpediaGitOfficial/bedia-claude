import { aboutPageData } from "@/constants/aboutData";
import AboutHeroSection from "@/components/sections/AboutHeroSection";
import TwoColumnSection from "@/components/sections/TwoColumnSection";
import FullWidthHeroSection from "@/components/sections/FullWidthHeroSection";

export const metadata = {
  title: "About Us | Bedia Pottery",
  description:
    "Learn about Bedia Pottery, our mission, vision, and our commitment to fostering creativity and community.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <AboutHeroSection
        title={aboutPageData.hero.title}
        points={aboutPageData.hero.points}
        subtitle={aboutPageData.hero.subtitle}
        description={aboutPageData.hero.description}
        imageUrl={aboutPageData.hero.imageUrl}
      />
      <div className="py-32 space-y-9">
        {/* Mission Section */}
        <TwoColumnSection
          title={aboutPageData.mission.title}
          description={aboutPageData.mission.description}
          imageUrl={aboutPageData.mission.imageUrl}
          imagePosition={aboutPageData.mission.imagePosition}
        />

        {/* Vision Section */}
        <TwoColumnSection
          title={aboutPageData.vision.title}
          description={aboutPageData.vision.description}
          imageUrl={aboutPageData.vision.imageUrl}
          imagePosition={aboutPageData.vision.imagePosition}
        />
      </div>
      {/* Full Width Hero Section */}
      <FullWidthHeroSection
        title={aboutPageData.fullWidth.title}
        subtitle={aboutPageData.fullWidth.subtitle}
        backgroundImageUrl={aboutPageData.fullWidth.backgroundImageUrl}
      />
    </main>
  );
}
