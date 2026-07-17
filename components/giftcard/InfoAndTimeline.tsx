'use client';
import { WorkshopItem } from '@/services/category.service';
import { useState } from 'react';
interface GiftCardHeroProps {
  product: WorkshopItem;
}

export default function InfoAndTimeline({ product }: GiftCardHeroProps) {
  const [activeTab, setActiveTab] = useState(product?.moreDetails?.[0]?._id );



  return (
    <section className="bg-[#f2ece3] min-h-screen py-16 font-sans text-[#113224]">
      <div className="page-wrapper px-[17px]  space-y-24">
        
        {/* --- TABS SECTION --- */}
        <div className="bg-white p-6 sm:p-10 shadow-sm rounded-sm">
          {/* Tab Headers */}
          <div className="bg-[#e2e6e3] p-2 flex flex-wrap lg:flex-nowrap gap-2 mb-8">
            {product?.moreDetails?.map((tab) => (
              <button
                key={tab._id}
                onClick={() => setActiveTab(tab._id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab._id 
                    ? 'bg-[#113224] text-white shadow-sm' 
                    : 'bg-[#c5ccc8] text-[#113224] hover:bg-[#b5beb9]'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-sm text-gray-800 leading-relaxed max-w-5xl whitespace-pre-wrap">
            {product?.moreDetails?.find((t) => t._id === activeTab)?.description || 'Select a tab to see more details.'}
          </div>
        </div>

        {/* --- TIMELINE SECTION --- */}
        <div className="text-center">
  <h2 className="text-3xl lg:text-4xl font-serif mb-3 text-[#113224]">Gifting Made Easy</h2>
  <p className="text-sm text-gray-600 mb-16 lg:mb-24">Three simple steps to send a creative experience they'll love.</p>

  {/* Desktop Arc Layout (Hidden on small screens) */}
  <div className="hidden lg:block relative w-[900px] h-[550px] mx-auto mt-32">
    
    {/* Dashed Semi-Circle Arc */}
    {/* 540px wide arc, centered */}
    <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[540px] h-[270px] border-t-[1px] border-l-[1px] border-r-[1px] border-dashed border-[#113224]/40 rounded-t-[300px]"></div>

    {/* Central Video */}
    <div className="absolute top-[250px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] z-0">
      <video 
        src="/video/bowl.mp4" 
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>

    {/* Step 02 (Top Center) */}
    <div className="absolute top-[120px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-2xl text-[#113224] shadow-sm z-10">
      02
      {/* Anchored Text: Above */}
      <div className="absolute bottom-full mb-6 w-[360px] text-center left-1/2 -translate-x-1/2">
        <h4 className="font-semibold text-lg text-black mb-2 tracking-tight">Create Something Special</h4>
        <p className="text-[14px] text-gray-800 leading-relaxed">
          Get hands-on with clay, learn new skills, and<br/>enjoy the process while we handle the rest.
        </p>
      </div>
    </div>

    {/* Step 01 (Bottom Left) */}
    {/* 180px from left edge precisely aligns with the 540px arc inside the 900px container */}
    <div className="absolute top-[390px] left-[180px] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-2xl text-[#113224] shadow-sm z-10">
      01
      {/* Anchored Text: Left */}
      <div className="absolute right-full mr-8 w-[280px] top-1/2 -translate-y-1/2 text-right">
        <h4 className="font-semibold text-lg text-black mb-2 tracking-tight">Choose Your Experience</h4>
        <p className="text-[14px] text-gray-800 leading-relaxed">
          Select your studio, date, and session<br/>—then lock in a creative experience<br/>you'll love.
        </p>
      </div>
    </div>

    {/* Step 03 (Bottom Right) */}
    <div className="absolute top-[390px] right-[180px] translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-2xl text-[#113224] shadow-sm z-10">
      03
      {/* Anchored Text: Right */}
      <div className="absolute left-full ml-8 w-[280px] top-1/2 -translate-y-1/2 text-left">
        <h4 className="font-semibold text-lg text-black mb-2 tracking-tight">Take Home Your Creations</h4>
        <p className="text-[14px] text-gray-800 leading-relaxed">
          We finish your pieces with care. Come<br/>back to collect your beautifully crafted,<br/>ready-to-use pottery.
        </p>
      </div>
    </div>
  </div>

  {/* Mobile Stacked Layout (Hidden on large screens) */}
  <div className="flex flex-col items-center gap-12 lg:hidden mt-12">
      {/* Central Video for Mobile */}
      <div className="w-[240px] h-[240px] rounded-full overflow-hidden shadow-lg border-[4px] border-[#f2ece3] mb-4">
      <video 
        src="/video/bowl.mp4" 
        className="w-full h-full object-cover" 
        autoPlay 
        loop 
        muted 
        playsInline
      />
    </div>

    {[
      { num: '01', title: 'Choose Your Experience', desc: "Select your studio, date, and session —then lock in a creative experience you'll love." },
      { num: '02', title: 'Create Something Special', desc: "Get hands-on with clay, learn new skills, and enjoy the process while we handle the rest." },
      { num: '03', title: 'Take Home Your Creations', desc: "We finish your pieces with care. Come back to collect your beautifully crafted, ready-to-use pottery." }
    ].map((step) => (
      <div key={step.num} className="flex flex-col items-center text-center max-w-sm px-4">
        <div className="bg-white text-[#113224] w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm mb-4">
          {step.num}
        </div>
        <h4 className="font-semibold text-lg text-black mb-2">{step.title}</h4>
        <p className="text-[14px] text-gray-800 leading-relaxed">{step.desc}</p>
      </div>
    ))}
  </div>
</div>
      </div>
    </section>
  );
}