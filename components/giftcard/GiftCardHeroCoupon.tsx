"use client";

import { useMemo, useState, ChangeEvent } from "react";
import { format } from "date-fns";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import DateSelector from "../product/DateSelector";
import TimeSlotSelector from "../product/TimeSlotSelector";
import { BookingService } from "@/services/booking.service";
import { getAvailabilityData } from "@/services/avaliablity.service";
import { Availability } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { confirmGiftRedeem } from "@/services/gift.service";

interface PresetBookingPayload {
  bookingId: string;
  giftStatus: string;
  occasion: string;
  personalMessage: string;
  workshop: {
    _id: string;
    title: string;
    slug: string;
    defaultSlots: Array<{
      _id: string;
      label: string;
      startTime: string;
      endTime: string;
      capacity: number;
    }>;
  };
  items: Array<{
    optionId: string;
    optionTitle: string;
    price: number;
    people: number;
    adult: number;
    child: number;
    subtotal: number;
  }>;
  totalPeople: number;
  grandTotal: number;
  currency: string;
}

interface GiftCardHeroProps {
  bookingData: PresetBookingPayload;
}

interface FormState {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

interface ValidationError {
  field: keyof FormState;
  message: string;
}

export default function GiftCardHero({ bookingData }: GiftCardHeroProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [dateError, setDateError] = useState("");
  const [slotError, setSlotError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Management States
  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [formError, setFormError] = useState("");

  const router = useRouter();

  const bookingItem = bookingData?.items?.[0] || {
    optionId: "",
    optionTitle: "N/A",
    price: 0,
    people: 1,
    adult: 0,
    child: 0,
  };
  const workshop = bookingData?.workshop || {
    _id: "",
    title: "",
    defaultSlots: [],
  };
  const occasion = bookingData?.occasion || "General";

  const formattedDate = useMemo(() => {
    return selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    const isSameDate =
      selectedDate && date.toDateString() === selectedDate.toDateString();

    if (isSameDate && selectedSlotId !== null) {
      setSelectedSlotId(null);
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
      setSelectedSlotId(null);
    }

    setDateError("");
    setAvailabilityError("");
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setSlotError("");
    setAvailabilityError("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter((err) => err.field !== name));
    setFormError("");
  };

  const validateSelection = () => {
    let isValid = true;
    const newErrors: ValidationError[] = [];

    if (!selectedDate) {
      setDateError("Please select a date before continuing.");
      isValid = false;
    } else {
      setDateError("");
    }

    if (!selectedSlotId) {
      setSlotError("Please select a time slot before continuing.");
      isValid = false;
    } else {
      setSlotError("");
    }

    if (!couponCode.trim()) {
      setAvailabilityError("Please enter a valid coupon/voucher code.");
      isValid = false;
    }

    // Form Input Validations
    if (!formData.firstName.trim()) {
      newErrors.push({ field: "firstName", message: "First name is required." });
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.push({ field: "lastName", message: "Last name is required." });
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.push({ field: "address", message: "Recipient address is required." });
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.push({ field: "phone", message: "Phone number is required." });
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.push({ field: "email", message: "Email address is required." });
      isValid = false;
    }

    setErrors(newErrors);
    if (newErrors.length > 0) {
      setFormError("Please complete all required details.");
    }

    return isValid;
  };

  const handleRedeem = async () => {
    if (!validateSelection()) return;

    setIsSubmitting(true);
    setAvailabilityError("");
    setFormError("");

    const availabilityData: Availability = {
      workshopId: workshop._id,
      bookingDate: formattedDate,
      slotId: selectedSlotId!,
      guests: bookingItem.people,
    };

    try {
      const availabilityResponse = await getAvailabilityData(availabilityData);
      const isAvailable = availabilityResponse?.result?.available === true;

      if (!isAvailable) {
        setAvailabilityError(
          availabilityResponse?.result?.reason || "Selected slot is not available."
        );
        setIsSubmitting(false);
        return;
      }

      // Dynamic variables applied here from our state object
      const redeemPayload = {
        bookingId: bookingData.bookingId,
        voucherCode: couponCode.trim(),
        bookingDate: formattedDate,
        slotId: selectedSlotId!,
        recipientName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        recipientPhone: formData.phone.trim(),
        recipientEmail: formData.email.trim(),
        recipientAddress: formData.address.trim(), 
      };

      const token = useAuthStore.getState().user?.token || undefined;
      const response = await confirmGiftRedeem(redeemPayload, token);

      if (response.success) {
        router.push("/success");
      }
    } catch (error) {
      setAvailabilityError(
        (error as Error)?.message || "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#f2ece3] min-h-screen py-12 font-sans text-[#113224]">
      <div className="page-wrapper px-[17px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Media Gallery */}
        <div className="space-y-4 h-auto lg:sticky lg:top-6">
          <div className="relative w-full aspect-video bg-gray-200 overflow-hidden rounded shadow-sm">
            <img
              src="/images/product/gift-card-1.png"
              alt="Gift boxes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 hover:bg-white/50 transition duration-300">
                <Play className="text-white fill-white ml-1" size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { _id: "1", image: "/images/product/gift-card-2.jpg", title: "Gift thumbnail 1" },
              { _id: "2", image: "/images/product/gift-card-3.jpg", title: "Gift thumbnail 2" },
              { _id: "3", image: "/images/product/gift-card-4.jpg", title: "Gift thumbnail 3" },
            ].map((img) => (
              <div key={img._id} className="aspect-video bg-gray-200 overflow-hidden rounded">
                <img
                  src={img.image}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Content & Integrated Controls */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-5xl font-serif mb-4 text-[#113224]">
              {workshop.title}
            </h1>
            <p className="text-[#113224]/80 leading-relaxed text-[17px]">
              Review your gift customization configurations and finalize your setup below by choosing a valid schedule availability.
            </p>
          </div>

          {/* Config Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border border-gray-100 rounded shadow-sm">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                Occasion
              </label>
              <div className="w-full bg-[#113224] text-white py-2 px-3 rounded text-sm font-medium text-center truncate">
                {occasion}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                Selected Material Option
              </label>
              <div className="w-full bg-[#113224] text-white py-2 px-3 rounded text-sm font-medium text-center truncate">
                {bookingItem.optionTitle}
              </div>
            </div>
          </div>

          {/* Recipient Input Details Form Block */}
          <div className="bg-white p-6 border border-gray-100 rounded shadow-sm space-y-4">
              {formError && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded text-xs text-red-600 font-medium">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-[#113224]"
                />
                {errors.find(e => e.field === "firstName") && (
                  <p className="text-xs text-red-500">{errors.find(e => e.field === "firstName")?.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-[#113224]"
                />
                {errors.find(e => e.field === "lastName") && (
                  <p className="text-xs text-red-500">{errors.find(e => e.field === "lastName")?.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">Address *</label>
              <input
                type="text"
                name="address"
                placeholder="Street address, apartment, suite, unit etc."
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-[#113224]"
              />
              {errors.find(e => e.field === "address") && (
                <p className="text-xs text-red-500">{errors.find(e => e.field === "address")?.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+971"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-[#113224]"
                />
                {errors.find(e => e.field === "phone") && (
                  <p className="text-xs text-red-500">{errors.find(e => e.field === "phone")?.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-[#113224]"
                />
                {errors.find(e => e.field === "email") && (
                  <p className="text-xs text-red-500">{errors.find(e => e.field === "email")?.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date Selector Box */}
          <div className="bg-white p-4 border border-gray-100 rounded shadow-sm">
            <DateSelector onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            {dateError && <p className="mt-2.5 text-sm text-red-600 font-medium">{dateError}</p>}
          </div>

          {/* Time Slots Box */}
          {workshop.defaultSlots?.length > 0 && (
            <div className="bg-white p-4 border border-gray-100 rounded shadow-sm">
              <TimeSlotSelector
                slots={workshop.defaultSlots.map((slot) => ({
                  ...slot,
                  capacity: Boolean(slot.capacity),
                }))}
                selectedSlotId={selectedSlotId}
                onSlotSelect={handleSlotSelect}
              />
              {slotError && <p className="mt-2.5 text-sm text-red-600 font-medium">{slotError}</p>}
            </div>
          )}

          {/* Coupon Redemption Field */}
          <div className="bg-white p-4 border border-gray-100 rounded shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Voucher Code Verification</label>
              <div className="flex border border-gray-200 rounded overflow-hidden">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter dynamic secure coupon code string"
                  className="flex-grow p-3 border-none focus:ring-0 text-sm bg-white outline-none"
                />
              </div>
            </div>

            {availabilityError && (
              <p className="text-sm text-red-600 font-medium bg-red-50 p-2.5 rounded border border-red-100">
                {availabilityError}
              </p>
            )}

            <button
              onClick={handleRedeem}
              disabled={isSubmitting}
              className="w-full bg-[#113224] text-white py-3.5 px-4 font-medium hover:bg-[#0c251a] transition-colors text-center text-sm disabled:bg-gray-400 rounded-sm shadow-sm"
            >
              {isSubmitting ? "Processing Redemption..." : "Confirm & Redeem Coupon"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}