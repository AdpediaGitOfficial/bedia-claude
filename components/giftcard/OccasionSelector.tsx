"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface OccasionSelectorProps {
  onOccasionSelect?: (occasion: string) => void;
  initialOccasion?: string;
  className?: string;
}

export default function OccasionSelector({
  onOccasionSelect,
  initialOccasion = "Birthday",
  className = "",
}: OccasionSelectorProps) {
  const [occasion, setOccasion] = useState(initialOccasion);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // All available occasions combined into a single master list
  const allOccasions = [
    "Birthday",
    "Anniversary",
    "Wedding",
    "Graduation",
    "Father's Day",
    "Mother's Day",
    "Valentine's Day",
    "Eid Celebrations",
    "Christmas",
    "New Year",
    "Just Because",
  ];

  // Define which items are natively visible at different screen breakpoints
  // Birthday & Anniversary -> Always visible
  // Wedding -> Visible from 'sm' (640px) up
  // Graduation -> Visible from 'md' (768px) up
  const visibleOccasions = [
    { name: "Birthday", className: "flex" },
    { name: "Anniversary", className: "flex" },
    { name: "Wedding", className: "hidden sm:flex" },
    { name: "Graduation", className: "hidden md:flex" },
  ];

  // The "more+" dropdown will automatically contain whatever is NOT currently visible on screen
  const getExtraOccasions = () => {
    // On small mobile screens (<640px), Wedding and Graduation move to the dropdown
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    // On tablet screens (<768px), Graduation moves to the dropdown
    const isTablet = typeof window !== "undefined" && window.innerWidth < 768;

    return allOccasions.filter((item) => {
      if (item === "Birthday" || item === "Anniversary") return false;
      if (item === "Wedding" && isMobile) return true;
      if (item === "Graduation" && (isMobile || isTablet)) return true;
      
      // Items that are always in the extra dropdown menu
      return ![ "Birthday", "Anniversary", "Wedding", "Graduation" ].includes(item);
    });
  };

  const [extraOccasions, setExtraOccasions] = useState<string[]>([]);

  // Update dropdown items dynamically on window resize
  useEffect(() => {
    const handleResize = () => setExtraOccasions(getExtraOccasions());
    handleResize(); // run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExtraSelected = extraOccasions.includes(occasion);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: string) => {
    setOccasion(item);
    if (onOccasionSelect) onOccasionSelect(item);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`w-full text-[#113224] ${className}`}>
      <label className="block font-medium mb-3 text-sm sm:text-base">
        Choose an Occasion
      </label>
      
      {/* Container adapts smoothly as items hide/show */}
      <div className="bg-[#e9e6df] p-1 flex items-center gap-1 relative font-sans w-full">
        {visibleOccasions.map((item) => {
          const isSelected = occasion === item.name;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSelect(item.name)}
              className={`py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium tracking-wide transition-all duration-150 items-center justify-center flex-1 text-center
                ${item.className}
                ${isSelected
                  ? "bg-[#113224] text-white shadow-sm font-semibold"
                  : "text-[#113224]/80 hover:bg-[#dcd8ce] bg-[#c3cbbf]/20"
                }
              `}
            >
              {item.name}
            </button>
          );
        })}

        {/* Dynamic "more+" action container */}
        <div className="flex-1 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`w-full py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium tracking-wide transition-all duration-150 flex items-center justify-center gap-1
              ${isExtraSelected
                ? "bg-[#113224] text-white shadow-sm font-semibold"
                : "text-[#113224]/80 hover:bg-[#dcd8ce] bg-[#c3cbbf]/20"
              }
            `}
          >
            <span className="truncate">
              {isExtraSelected ? occasion : "more+"}
            </span>
            <ChevronDown 
              size={14} 
              className={`transform transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Popover Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 sm:w-56 bg-white border border-gray-200 shadow-xl rounded-md overflow-hidden z-30">
              <div className="py-1 max-h-60 overflow-y-auto">
                {extraOccasions.map((item) => {
                  const isSelected = occasion === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${isSelected
                          ? "bg-[#113224] text-white font-medium"
                          : "text-gray-700 hover:bg-[#f2ece3]"
                        }
                      `}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}