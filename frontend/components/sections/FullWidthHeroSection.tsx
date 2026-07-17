"use client";

import React from "react";
import { Title, Content } from "@/components/ui";

interface FullWidthHeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
}

const FullWidthHeroSection: React.FC<FullWidthHeroSectionProps> = ({
  title,
  subtitle,
  backgroundImageUrl,
}) => {
  return (
    <section
      className="relative min-h-[385px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_3.64%,rgba(0,0,0,0.9)_100%)]" />

      {/* Content */}
      <div className="relative z-10 text-center text-white  px-9">
        <Title className="!text-white mb-4 font-normal">{title}</Title>
        <Content className="!text-white text-lg">{subtitle}</Content>
      </div>
    </section>
  );
};

export default FullWidthHeroSection;
