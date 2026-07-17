import { WorkshopItem } from "@/services/workshop.service";

  interface BirthdayProps {
    product: WorkshopItem
  }
  
  const BirthdayDetails: React.FC<BirthdayProps> = ({
    product
  }) => {
  const timelineSteps = [
    { num: '01', title: 'Arrival & Welcome', time: '15 Mins', desc: 'Kids Settle In And Get Ready For The Fun' },
    { num: '02', title: 'Pottery Workshop', time: '60 Mins', desc: 'Hands-On Pottery Making With Instructors' },
    { num: '03', title: 'Drying & Packing', time: '10 Mins', desc: 'Pottery Is Carefully Packed To Take Home' },
    { num: '04', title: 'Cake Cutting', time: '45 Mins', desc: 'Celebration Time With Cake And Snacks' },
    { num: '05', title: 'Take-Home Gifts', time: '05 Mins', desc: 'Each Child Leaves With Their Creation' }
  ];

  return (
    <section className="py-16 font-sans text-[#113224] bg-[#f5f1eb]">
      <div className="page-wrapper px-[17px]  space-y-16">
        
        {/* --- TIMELINE SECTION --- */}
        <div>
          <h2 className="text-2xl font-neiko text-[#113224] mb-6">Birthday Pottery Event Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {timelineSteps.map((step, i) => (
              <div key={i} className="bg-white p-6 flex flex-col items-center text-center shadow-sm">
                <span className="text-2xl text-[#113224] mb-3">{step.num}</span>
                <h3 className="font-semibold text-[14px] text-black mb-4">{step.title}</h3>
                <span className="bg-[#113224] text-white text-[11px] px-4 py-1.5 mb-4 tracking-wide">
                  {step.time}
                </span>
                <p className="text-[12px] text-gray-700 leading-relaxed max-w-[140px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- THE BEST PART --- */}
        <div>
          <h2 className="text-2xl font-neiko text-[#113224] mb-6">The Best Part:</h2>
          <div className="bg-white p-8 lg:p-10 shadow-sm">
            <p className="text-[14px] text-black leading-relaxed mb-1">
              Air dry clay is soft and easy to mold, and it hardens on its own - no kiln or oven needed! It's perfect for little hands to shape and bring their ideas to life.
            </p>
            <p className="text-[14px] text-black leading-relaxed mb-1">
              No firing needed! The kids can take their creations home the same day and paint them later at their own convenience. Plus, skip the goody bags just give them their pots as the perfect gift!
            </p>
            <p className="text-[14px] text-black leading-relaxed">
              The items created using air dry clay are NOT FOOD SAFE and can only be used for decorative purposes.
            </p>
          </div>
        </div>

        {/* --- NOTE FOR THE PARENTS --- */}
        <div>
          <h2 className="text-2xl font-neiko text-[#113224] mb-6">Note For The Parents</h2>
          <div className="bg-white p-8 lg:p-10 shadow-sm">
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-black marker:text-[#113224]">
              <li>Cake is allowed to be cut inside the studio</li>
              <li>Outside food and drink are allowed within the provided time, or else additional charges may incur per hour.</li>
              <li>Cutlery and other food-serving essentials should be brought from your end.</li>
              <li>The studio will provide a knife and lighter for the cake, if required.</li>
              <li>We recommend arranging pick-up and drop-off for the kids attending the workshop.</li>
              <li>If any parent wishes to stay during the session, please inform us in advance.</li>
              <li>Pets are not allowed inside the studio premises.</li>
              <li>Adults are kindly requested not to interfere in the workshop area. However, they're welcome to sit at the table next to the workstation and enjoy observing.</li>
              <li>Kids and adults are only allowed to use the areas designated for them.</li>
            </ul>
          </div>
        </div>

        {/* --- VENUE CAPACITY DETAILS --- */}
        <div>
          <h2 className="text-2xl font-neiko text-[#113224] mb-6">Venue Capacity Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pottery on Wheel */}
            <div className="bg-white p-8 lg:p-10 text-center shadow-sm flex flex-col items-center">
              <div className="bg-[#e4ece8] text-[#113224] w-full py-4 text-[15px] mb-8">
                Pottery on Wheel (Ideal Age Group: 4 years - 13 years)
              </div>
              <p className="text-[14px] text-black mb-2">Minimum Number Of Participants: 12</p>
              <p className="text-[14px] text-black">Maximum Number Of Participants: 25</p>
            </div>

            {/* Hand building */}
            <div className="bg-white p-8 lg:p-10 text-center shadow-sm flex flex-col items-center">
              <div className="bg-[#e4ece8] text-[#113224] w-full py-4 text-[15px] mb-8">
                Hand building (Ideal Age Group: 3 years - 13 years)
              </div>
              <p className="text-[14px] text-black mb-2">Minimum Number Of Participants: 12</p>
              <p className="text-[14px] text-black">Maximum Number Of Participants: 35</p>
            </div>

          </div>
        </div>

        {/* --- PACKAGE INCLUDES --- */}
        <div>
          <h2 className="text-2xl font-neiko text-[#113224] mb-6">Package Includes</h2>
          <div className="bg-white p-8 lg:p-10 shadow-sm">
            {(() => {

              const packageIncludes = (product.includes?.map((item) => item.title) )

              const columns = [[], [], []] as string[][]

              packageIncludes.forEach((item, index) => {
                columns[index % columns.length].push(item)
              })

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
                  {columns.map((columnItems, index) => (
                    <ul
                      key={index}
                      className="list-disc pl-5 space-y-2 text-[13px] text-black marker:text-[#113224]"
                    >
                      {columnItems.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>

      </div>
    </section>
  );
}
export default BirthdayDetails;