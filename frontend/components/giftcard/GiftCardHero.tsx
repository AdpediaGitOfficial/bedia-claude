"use client";

import { useMemo, useState, useEffect } from "react";
import { Play, User2 } from "lucide-react";
import QuantitySelector from "../product/QuantitySelector";
import { WorkshopItem } from "@/services/workshop.service";
import { BookingData } from "@/types";
import { useAuthStore } from "@/store/authStore";
import MaterialSelector from "../product/MaterialSelector";
import { WorkshopOption } from "@/services/workshop.service";
import { BookingService } from "@/services/booking.service";
import OccasionSelector from "./OccasionSelector";
import Link from "next/link";
import ImageGrid from "../common/ImageGrid";

function getUniqueMaterials(options?: WorkshopOption[]) {
  return (
    options
      ?.filter(
        (option) =>
          !option.title.toLowerCase().includes("adults & kids") &&
          option.title.toLowerCase().includes("adults"),
      )
      .map((option) => ({
        ...option,
        title: option.title.replace(/\s*-\s*Adults$/i, ""),
      })) ?? []
  );
}

interface GiftCardHeroProps {
  product: WorkshopItem;
}

export default function GiftCardHero({
  product,
}: GiftCardHeroProps) {
  const bookingService = new BookingService();
  const [quantity, setQuantity] = useState(1);
  const [occasion, setOccasion] = useState("Birthday");
  const [recipient, setRecipient] = useState("Adults");
  const [message, setMessage] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [showCartToast, setShowCartToast] = useState(false);

  // 1. Get auth state from your store
  const user = useAuthStore((state) => state.user);
  const userId = user?.userId ?? "";
  const token: string | null = useAuthStore.getState().user?.token || null
  const uniqueMaterials = useMemo(
    () => getUniqueMaterials(product?.options),
    [product?.options],
  );

  const [selectedMaterialId, setSelectedMaterialId] = useState(
    () => getUniqueMaterials(product?.options)[0]?._id ?? "",
  );

  useEffect(() => {
    if (
      uniqueMaterials.length > 0 &&
      !uniqueMaterials.some((m) => m._id === selectedMaterialId)
    ) {
      setSelectedMaterialId(uniqueMaterials[0]._id);
    }
  }, [uniqueMaterials, selectedMaterialId]);

  const selectedClay = useMemo(
    () => product?.options?.find((m) => m._id === selectedMaterialId),
    [product?.options, selectedMaterialId],
  );

  const selectedMaterial = useMemo(() => {
    if (!selectedClay) return null;

    return product?.options?.find(
      (option) =>
        option.clayTypeId === selectedClay.clayTypeId &&
        option.title.toLowerCase().includes(recipient.toLowerCase()),
    );
  }, [product?.options, selectedClay, recipient,]);
  const handleCheck = async () => {
    setAvailabilityError(""); // Clear previous errors

    // 2. Intercept check if user is not logged in
    if (!token || token == null) {
      console.log(token)
      setAvailabilityError("Your cart is tied to your account. Please log in to continue.");
      return false;
    }

    const bookingData: BookingData = {
      userId,
      bookingType: "gift",
      workshopId: product._id,
      optionId: selectedMaterial?._id || "",
      people: quantity,
      giftDetails: {
        occasion: occasion,
        personalMessage: message,
      },
      ...(recipient === "Adults" && {
        adult: quantity,
      }),
      ...(recipient === "Kids" && {
        child: quantity,
      }),
    };


    try {
      await bookingService.addToCart(bookingData);
      setShowCartToast(true);
      setTimeout(() => setShowCartToast(false), 8000);
      return true;
    } catch (error) {
      setAvailabilityError(
        (error as Error)?.message ||
          "Unable to add booking to cart. Please try again.",
      );
      return false;
    }
  };

  return (
    <section className="bg-[#f2ece3] min-h-screen md:py-12 py-3 font-sans text-[#113224]">
      {showCartToast && (
        <div className="fixed top-20 left-0 right-0 w-full bg-[#68bc60] text-white py-3.5 px-6 z-[9999] shadow-sm animate-in fade-in slide-in-from-top duration-300">
          <div className="page-wrapper flex justify-end items-center text-sm font-medium">
            <div>
              Your item has been added to bag.{" "}
              <Link
                href="/cart"
                className="underline underline-offset-2 font-bold hover:opacity-90 ml-1"
              >
                Checkout now
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="page-wrapper relative px-[17px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Media Gallery */}
        <div className="space-y-4 md:h-[calc(100vh-80px)] flex flex-col">
          <ImageGrid images={product?.images?.map((img) => img.image) || []} />
        </div>

        {/* Right Column: Content & Form */}
        <div className="flex flex-col lg:sticky lg:top-24 h-fit self-start">
          <div className="mb-8">
            <h1 className="text-5xl font-serif mb-4 text-[#113224]">
              {product?.title || "A Gift Made by Hand, from the Heart"}
            </h1>
            <p className="text-[#113224]/80 leading-relaxed text-[17px]">
              {product?.shortDescription ||
                "Give the gift of creativity, experiences, and lasting memories. Perfect for anyone who loves to create something truly unique and meaningful."}
            </p>
          </div>

          <div className="bg-white shadow-xl shadow-black/5 flex flex-col">
            <div className="bg-[#113224] text-white text-center py-6 px-4 relative overflow-hidden">
              <h2 className="text-lg font-medium mb-1 relative z-10">
                Customize Your Gift Card
              </h2>
              <p className="text-sm text-white/80 relative z-10">
                Make it personal, make it memorable
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Occasion Section */}
              <div>
                <OccasionSelector
                  initialOccasion={occasion}
                  onOccasionSelect={(selectedItem) => setOccasion(selectedItem)}
                />
              </div>

              {/* Recipient Selection */}
              <div>
                <label className="block font-medium mb-3">
                  Who is this Gift for?
                </label>
                <div className="bg-[#e9e6df] p-1 flex gap-1">
                  {["Adults", "Kids"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRecipient(item)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        recipient === item
                          ? "bg-[#113224] text-white"
                          : "text-gray-600 hover:bg-[#d8d4cb]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clay Type Selector */}
              {uniqueMaterials && uniqueMaterials.length > 0 && (
                <div>
                  <label className="block font-medium mb-3 text-capitalize">
                    Choose your clay
                  </label>
                  <MaterialSelector
                    materials={uniqueMaterials}
                    selectedMaterialId={selectedMaterialId}
                    onMaterialSelect={setSelectedMaterialId}
                  />
                </div>
              )}

              {/* Message Input text field */}
              <div>
                <label className="block font-medium mb-3">
                  Add a personal message{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    ({message.length} / 250 characters)
                  </span>
                </label>

                <textarea
                  name="personalMessage"
                  maxLength={250}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#dce1dd] text-[#113224] placeholder-[#113224]/50 border-none p-4 h-24 text-sm focus:ring-0 focus:outline-none resize-none"
                  placeholder="Hope you enjoy getting your hands dirty and creating something beautiful"
                />
              </div>

              {/* Quantity Handler */}
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((prev) => prev + 1)}
                onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
                limit={1}
                unitPrice={selectedMaterial?.price}
                currency={selectedMaterial?.currency ?? "AED"}
                onCart={handleCheck}
                buttonlabel={ "Add to cart" }
              />
{availabilityError && (
            <p className="text-sm text-red-600">{availabilityError} <Link
									href="/login"
									className="inline-flex items-center justify-center gap-2  border border-[#113224] px-6 py-1 font-medium text-[#113224] transition-colors hover:bg-[#113224] hover:text-white"
								>
									go to login
								</Link></p>
          )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}