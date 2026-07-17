"use client";

import React, { useEffect } from "react";
import type { HeroSlide } from "@/types";
import { Title, Subtitle, Content } from "@/components/ui";
import ExploreButton from "../ui/ExploreButton";
import { getCategoryData } from "@/services/category.service";

interface HeroSectionProps {
  slides?: HeroSlide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const slide = slides?.[0]; // Use API hero slide if available
  return (
    <section className="relative overflow-hidden bg-[#EDE7D9]">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-var(--header-h))] lg:gap-[15px] ">
        {/* ================= LEFT SECTION ================= */}
        <div className="relative w-full lg:w-1/2 h-[55vw] min-h-[300px] lg:h-full overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center flex items-end justify-center relative pb-[80px] lg:pb-[120px]"
            style={{ backgroundImage: `url(${slide?.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_-23.93%,rgba(0,0,0,0.9)_100%)]" />
          </div>

          {/* TEXT */}
          <div className="absolute bottom-[80px] lg:bottom-[120px] w-full flex justify-center text-center z-30 px-4">
            <div className="max-w-xl">
              <Subtitle className="!text-white mb-1 lg:mb-2 !text-[10px] lg:!text-sm">
                {slide?.title}
              </Subtitle>
              <Title className="!text-white mb-2 lg:mb-4 font-normal !text-lg lg:!text-3xl">
                {slide?.shortDescription}
              </Title>
              <Content className="!text-white hidden lg:block">
                {slide?.description}
              </Content>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="relative w-full lg:flex-1 lg:h-full overflow-hidden">
          <div className="grid grid-cols-1  p-3 lg:absolute lg:inset-0 lg:grid-cols-2 lg:grid-rows-2 gap-[15px] lg:py-[15px] lg:pr-[15px] lg:pl-0">
            {slide?.cards?.slice(0, 4)?.map((card: any, index: number) => {
              const cardHref = card.category?.slug
                ? `/workshops/${card.category.slug}`
                : "#";

              return (
                <div
                  key={card._id ?? card.id}
                  className={`w-full overflow-hidden ${
                    index === 3
                      ? "bg-primary flex flex-col justify-center p-4 lg:p-6 lg:min-h-0"
                      : " lg:min-h-0 lg:h-full"
                  }`}
                >
                  {index < 3 ? (
                    <div className="relative w-full h-full min-h-[420px] md:min-h-[40vw] lg:min-h-0 overflow-hidden group">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${card.category?.image})`,
                        }}
                      />
                   <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                      <div className="relative z-10 h-full w-full flex flex-col items-center justify-end text-center px-3 lg:px-6 pb-5">
                        <div className="opacity-0  group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <Subtitle className="!text-secondary-off mb-1 lg:mb-2 !text-[10px] lg:!text-sm">
                        {card.title}
                      </Subtitle>

                      <Title className="!text-secondary-off mb-2 lg:mb-4 !text-base lg:!text-[32px] font-normal">
                        {card.category?.subtitle}
                      </Title>

                      <Content className="!text-secondary-off mb-4 lg:mb-10 hidden lg:block">
                        {card.shortDescription}
                      </Content>
                          <ExploreButton href={`/workshops/${card.category?.slug}`} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center  min-h-[420px] lg:min-h-full relative z-10 flex flex-col items-center justify-end ">
                      <Subtitle className="!text-secondary-off mb-1 lg:mb-2 !text-[10px] lg:!text-sm">
                        {card.category?.title}
                      </Subtitle>

                      <Title className="!text-secondary-off mb-2 lg:mb-4 !text-base lg:!text-[32px] font-normal">
                        {card.category?.subtitle}
                      </Title>

                      <Content className="!text-secondary-off mb-4 lg:mb-10 hidden md:block">
                        {card.category?.shortDescription}
                      </Content>

                      <ExploreButton href={`/workshops/${card.slug}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
