import { Users, Store, Gift, CircleParking, Cake, ShieldCheck } from 'lucide-react';

export default function FeatureBanner() {
  const features = [
    { icon: Users, label: 'Expert Instructors' },
    { icon: Store, label: 'Studio' },
    { icon: Gift, label: 'Take-Home Pottery' },
    // { icon: CircleParking, label: 'Free Parking' },
    { icon: Cake, label: 'Cake Allowed' },
    { icon: ShieldCheck, label: 'Safe & Supervised' },
  ];

  return (
    <section className="py-12 font-sans bg-[#f5f1eb]">
      <div className="page-wrapper bg-white py-10 shadow-sm border border-gray-100">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 lg:gap-y-0 lg:divide-x divide-gray-300/60">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center px-4"
              >
                {/* 
                  Using Lucide React icons here. 
                  For production, swap these <Icon /> tags with your custom SVG line-art paths 
                */}
                <div className="text-[#113224] mb-4 h-12 flex items-center justify-center">
                  <Icon size={36} strokeWidth={1.2} />
                </div>
                
                <span className="text-[#113224] text-[13px] md:text-[14px] font-medium text-center whitespace-nowrap">
                  {feature.label}
                </span>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}