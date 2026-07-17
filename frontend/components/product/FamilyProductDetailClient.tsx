'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { format } from 'date-fns'
import { BookingData, Availability } from '@/types'
import { WorkshopItem } from '@/services/workshop.service'
import ProductMedia from './ProductMedia'
import PriceDisplay from './PriceDisplay'
import MaterialSelector from './MaterialSelector'
import MaterialDescription from './MaterialDescription'
import DateSelector from './DateSelector'
import TimeSlotSelector from './TimeSlotSelector'
import QuantitySelector from './QuantitySelector'
import BookingActions from './BookingActions'
import { BookingService, IBookingService } from '@/services/booking.service'
import { getAvailabilityData, getPotteryCapacity, PotteryCapacityResult } from '@/services/avaliablity.service'
import { Content, Title } from '../ui'
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProductDetailClientProps {
  product: WorkshopItem
  bookingService?: IBookingService
}

const FamilyProductDetailClient: React.FC<ProductDetailClientProps> = ({
  bookingService = new BookingService(),
  product
}) => {
  useEffect(() => {   
    console.log('Received product data:', product)
  }, [product])
  const [selectedMaterialId, setSelectedMaterialId] = useState(
    product.options?.[0]?._id || ''
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [childCount, setChildCount] = useState(1)
  const [dateError, setDateError] = useState<string>('')
  const [slotError, setSlotError] = useState<string>('')
  const [availabilityError, setAvailabilityError] = useState<string>('')
  const [capacityInfo, setCapacityInfo] = useState<PotteryCapacityResult | null>(null)
  const [capacityLoading, setCapacityLoading] = useState(false)
  const [capacityError, setCapacityError] = useState<string>('')
  const userId: string = useAuthStore.getState().user?.userId ?? ''
const formattedDate = useMemo(() => {
  return selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : ''
}, [selectedDate])
const router = useRouter()
  // Derived state - computed values
const selectedMaterial = useMemo(
  () => product.options?.find((m) => m._id === selectedMaterialId),
  [product.options, selectedMaterialId]
);

  const totalGuests = quantity + childCount
  const quantityLimit = Math.max(capacityInfo?.remainingCapacity ?? 12, 0)


  const validateSelection = () => {
    let isValid = true
    if (!selectedDate) {
      setDateError('Please select a date before continuing.')
      isValid = false
    } else {
      setDateError('')
    }

    if (!selectedSlotId) {
      setSlotError('Please select a time slot before continuing.')
      isValid = false
    } else {
      setSlotError('')
    }

    return isValid
  }

const relatedOptions = useMemo(() => {
  if (!selectedMaterial) return [];

  return (
    product.options?.filter(
      option => option.clayTypeId === selectedMaterial.clayTypeId
    ) || []
  );
}, [product.options, selectedMaterial]);

const extraChildPrice = useMemo(() => {
  return (
    relatedOptions.find(option =>
      option.title.toLowerCase().includes("extra child")
    )?.price || 0
  );
}, [relatedOptions]);

const extraAdultPrice = useMemo(() => {
  return (
    relatedOptions.find(option =>
      option.title.toLowerCase().includes("extra adult")
    )?.price || 0
  );
}, [relatedOptions]);

const totalPrice = useMemo(() => {
  if (!selectedMaterial) return 0;

  const extraAdults = Math.max(0, quantity - 1);
  const extraChildren = Math.max(0, childCount - 1);

  return (
    selectedMaterial.price +
    extraAdults * extraAdultPrice +
    extraChildren * extraChildPrice
  );
}, [
  selectedMaterial,
  quantity,
  childCount,
  extraAdultPrice,
  extraChildPrice,
]);

  // Event handlers - single responsibility per handler
const handleDateSelect = (date: Date) => {
  const isSameDate =
    selectedDate &&
    date.toDateString() === selectedDate.toDateString()

  if (isSameDate) {
    setSelectedDate(null)
    setSelectedSlotId(null)
  } else {
    setSelectedDate(date)
    setSelectedSlotId(null)

    console.log('Date object:', date)
    console.log(
      'Formatted:',
      format(date, 'yyyy-MM-dd')
    )
  }

  setDateError('')
  setAvailabilityError('')
  setCapacityError('')
}
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId)
    setSlotError('')
    setAvailabilityError('')
    setCapacityError('')
  }

  useEffect(() => {
    const fetchCapacity = async () => {
      if (!selectedDate || !selectedSlotId) {
        setCapacityInfo(null)
        setCapacityError('')
        return
      }

      const slot = product.defaultSlots.find((s) => s._id === selectedSlotId)
      if (!slot) return

      setCapacityLoading(true)
      setCapacityError('')
      try {
        const res = await getPotteryCapacity({
          workshopId: product._id,
          bookingDate: formattedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })

        setCapacityInfo(res.result ?? null)
      } catch (err: any) {
        console.error('Family capacity fetch error', err)
        setCapacityError(err?.message || 'Unable to fetch capacity')
        setCapacityInfo(null)
      } finally {
        setCapacityLoading(false)
      }
    }

    fetchCapacity()
  }, [selectedDate, selectedSlotId, formattedDate, product.defaultSlots, product._id])

const handleAddToCart = async () => {
 const token: string | null = useAuthStore.getState().user?.token || null
  if (!token) {
    router.push('/login');
    return;
  }
  const success = await handlecheck('cart')
  if (success) {
    router.push('/cart')
  }
}

const handleBookNow = async () => {
 const token: string | null = useAuthStore.getState().user?.token || null
  if (!token) {
    router.push('/login');
    return;
  }
  const success = await handlecheck('checkout')
  if (success) {
    router.push('/checkout')
  }
}

const handlecheck = async (destination: 'cart' | 'checkout') => {
  if (!validateSelection()) {
    return false;
  }

  setAvailabilityError('')

  const bookingData: BookingData = {
    userId: userId,
     bookingType: "pottery",
    workshopId: product._id,
    optionId: selectedMaterialId,
    bookingDate: formattedDate,
    slotId: selectedSlotId!,
    people: quantity + childCount,
    adult: quantity,
    child: childCount
  };

  const availabilityData: Availability = {
    workshopId: product._id,
    bookingDate: formattedDate,
    slotId: selectedSlotId!,
    guests: totalGuests,
  };

  const availabilityResponse = await getAvailabilityData(availabilityData);
  const isAvailable = availabilityResponse?.result?.available === true;
  const isAvailableMessage = availabilityResponse?.result?.reason;

  if (!isAvailable) {
    setAvailabilityError(
      isAvailableMessage ||
        'Selected slot is not available. Please choose another date or time.'
    );
    return false;
  }

  setAvailabilityError('');

  try {
    await bookingService.addToCart(bookingData);
    return true;
  } catch (error) {
    setAvailabilityError(
      (error as Error)?.message ||
        'Unable to add booking to cart. Please try again.'
    );
    return false;
  }
};


  const isBookingDisabled =
    !selectedDate ||
    !selectedSlotId ||
    totalGuests <= 0 ||
    (capacityInfo?.remainingCapacity !== undefined && totalGuests > capacityInfo.remainingCapacity)
const uniqueMaterials = product?.options?.filter(option =>
  option.title.toLowerCase().includes('adults') &&
  !option.title.toLowerCase().includes('adults & kids')
);
  return (
    <div className="page-wrapper ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Media */}
        <ProductMedia
          imageUrl={product?.bannerImage || '/images/product/1.png'}
          alt={product?.title}
        />

        {/* Right Section - Booking Panel */}
        <div className=" md:p-6 lg:p-8 space-y-6 ">
          <div>
                <Title className="2xl:mb-7 mb-5 font-normal">{product?.title}</Title>
            {product?.description && (
               <Content className=" leading-relaxed mb-7">
                       {product?.description}
                        </Content>
             
            )}
          </div>

<div className="p-[18px] bg-white">
          {/* Material Selector */}
          {uniqueMaterials && uniqueMaterials.length > 0 && (
            <MaterialSelector
              materials={uniqueMaterials}
              selectedMaterialId={selectedMaterialId}
              onMaterialSelect={setSelectedMaterialId}
            />
          )}

          {/* Material Description */}
          {selectedMaterial && selectedMaterial.description && (
            <MaterialDescription
              materialName={selectedMaterial.title}
              description={selectedMaterial.description}
            />
          )}
</div>
          {/* Date Selector */}
          <div className="p-[18px] bg-white">
            <DateSelector
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            {dateError && (
              <p className="mt-3 text-sm text-red-600">
                {dateError}
              </p>
            )}
          </div>

          {/* Time Slots */}
          {product?.defaultSlots.length > 0 && (
            <div className="p-[18px] bg-white">
              <TimeSlotSelector
                slots={product.defaultSlots.map((slot) => ({
                  ...slot,
                  capacity: Boolean(slot.capacity),
                }))}
                selectedSlotId={selectedSlotId}
                onSlotSelect={handleSlotSelect}
              />
              {slotError && (
                <p className="mt-3 text-sm text-red-600">
                  {slotError}
                </p>
              )}

              {capacityLoading && (
                <p className="mt-3 text-sm text-gray-600">Checking capacity...</p>
              )}

              {capacityError && (
                <p className="mt-3 text-sm text-red-600">{capacityError}</p>
              )}

              {capacityInfo && !capacityError && (
                capacityInfo.remainingCapacity === 0 ? (
                  <p className="mt-3 text-sm text-red-600">
                    Sorry, this time slot is fully booked. Please select another time slot or date.
                  </p>
                ) : (
                  <div className="mt-3 text-sm text-green-700">
                    <p>
                      <strong>Available stock:</strong> {capacityInfo.remainingCapacity}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {/* Quantity Selector */}
            <div className="p-[18px] bg-white">
             
          <QuantitySelector
  quantity={quantity}
  limit={quantityLimit}
  onIncrease={() => {
    if (totalGuests < quantityLimit) {
      setQuantity(quantity + 1)
    }
  }}
  onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
  onchildIncrease={() => {
    if (totalGuests < quantityLimit) {
      setChildCount(childCount + 1)
    }
  }}
  onchildDecrease={() => setChildCount(Math.max(1, childCount - 1))}
  totalPrice={totalPrice}
  currency={selectedMaterial?.currency || "AED"}
  onCart={handleAddToCart}
  child={true}
  childCount={childCount}
/>
</div>
          {/* Booking Actions */}
          {availabilityError && (
            <p className="text-sm text-red-600">{availabilityError}</p>
          )}
          <BookingActions
            onBookNow={handleBookNow}
            isBookingDisabled={isBookingDisabled}
          />
        </div>
      </div>
    </div>
  )
}

export default FamilyProductDetailClient
