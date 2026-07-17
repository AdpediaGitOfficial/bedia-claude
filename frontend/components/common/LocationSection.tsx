import React from "react";
import Image from "next/image";
import { MapPin, Star, ExternalLink, Navigation } from "lucide-react";

const LocationSection: React.FC = () => {
  // Direct Google Maps search link for user navigation
  const mapsUrl = "https://maps.google.com/?q=Bedia+Pottery+Al+Quoz+Dubai";

  return (
    <section className="w-full ">
      <div className="">
        {/* Responsive Split Container Layout inspired by image_fd6f9b.jpg */}
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] border border-gray-200  overflow-hidden shadow-sm bg-white min-h-[450px] md:min-h-[550px]">
          {/* Left Column: Storefront Presentation Image */}
          <div className="relative w-full lg:h-[300px] h-screen  min-h-[300px] lg:block hidden">
            <Image
              src="/images/banner/storefront.png" // Replace with your image asset path (referencing look from image_fd6f9b.jpg)
              alt="Bedia Pottery Studio Entrance"
              objectFit="center"
              width={800}
              height={600}
              sizes="(max-w-1024px) 100vw, 35vw"
              priority
            />
            {/* Dark tinted gradient overlay for better image contrast */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          </div>

          {/* Right Column: Google Maps Screen & Overlaid Info Block */}
          <div className="relative w-full h-[400px] lg:h-full min-h-[400px] bg-[#aad3df]">
            {/* Interactive Embedded Live Map iframe */}
            <iframe
              title="Bedia Pottery Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.8818055822917!2d55.2286163!3d25.1396865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69be5e716b71%3A0x79d624863c4c5812!2sBedia%20Pottery%20%7C%20Adults%20%26%20Kids%20Birthday%20Party%20Packages%20%2B%20Fun%20Beginners%20Workshop!5e0!3m2!1sen!2sin!4v1782905927941!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
