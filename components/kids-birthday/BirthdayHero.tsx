'use client';
import { Key, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Minus, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import DateSelector from '../product/DateSelector';
import { WorkshopItem } from '@/services/workshop.service';
import TimeSlotSelector from '../product/TimeSlotSelector';
import { useRouter } from 'next/navigation';
import { BookingService } from '@/services/booking.service';
import { getAvailabilityData, getPotteryCapacity, PotteryCapacityResult } from '@/services/avaliablity.service';
import { BookingData, Availability } from '@/types';
import { useAuthStore } from '@/store/authStore';
import QuantitySelector from '../product/QuantitySelector';
import BookingActions from '../product/BookingActions';
import MaterialSelector from '../product/MaterialSelector';
import MaterialDescription from '../product/MaterialDescription';

interface BirthdayProps {
  product: WorkshopItem;
  type?: 'kids' | 'adults';
}

const BirthdayHero: React.FC<BirthdayProps> = ({ product, type }) => {
  useEffect(() => {
    console.log('Received product data in BirthdayHero:', product);
  }, [product]);

  const makeTypes = [
    { id: 'wheel', label: 'Wheel' },
    { id: 'hand-building', label: 'Hand Building' },
  ];

  const [makeType, setMakeType] = useState('');
  const [quantity, setQuantity] = useState(type === 'kids' ? 12 : 10);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string>('');
  const [slotError, setSlotError] = useState<string>('');
  const [availabilityError, setAvailabilityError] = useState<string>('');
  const [capacityInfo, setCapacityInfo] = useState<PotteryCapacityResult | null>(null);
  const [capacityLoading, setCapacityLoading] = useState(false);
  const [capacityError, setCapacityError] = useState<string>('');
  const router = useRouter();
  const bookingService = new BookingService();
  const userId: string = useAuthStore.getState().user?.userId ?? '';

  const [selectedMaterialId, setSelectedMaterialId] = useState(product.options?.[0]?._id || '');
  const selectedMaterial = useMemo(
    () => product.options?.find((m) => m._id === selectedMaterialId),
    [product.options, selectedMaterialId]
  );

  const [activeTab, setActiveTab] = useState(product.moreDetails?.[0]?._id || '');
  const activeContent = product.moreDetails.find((item) => item._id === activeTab);

  const formattedDate = useMemo(() => (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''), [selectedDate]);

  const quantityLimit = capacityInfo?.remainingCapacity ?? (type === 'kids' ? 12 : 10);

  useEffect(() => {
    if (capacityInfo && quantity > capacityInfo.remainingCapacity) {
      setQuantity(Math.max(1, capacityInfo.remainingCapacity));
    }
  }, [capacityInfo, quantity]);

  const handleDateSelect = (date: Date) => {
    const isSameDate = selectedDate && date.toDateString() === selectedDate.toDateString();

    if (isSameDate && showTimeSlots) {
      setShowTimeSlots(false);
      setSelectedSlotId(null);
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
      setShowTimeSlots(true);
      setSelectedSlotId(null);
    }

    setDateError('');
    setAvailabilityError('');
    setCapacityError('');
    setCapacityInfo(null);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setSlotError('');
    setAvailabilityError('');
    setCapacityError('');
  };

  useEffect(() => {
    const fetchCapacity = async () => {
      if (!selectedDate || !selectedSlotId) {
        setCapacityInfo(null);
        setCapacityError('');
        return;
      }

      const slot = product.defaultSlots.find((s) => s._id === selectedSlotId);
      if (!slot) return;

      setCapacityLoading(true);
      setCapacityError('');
      try {
        const res = await getPotteryCapacity({
          workshopId: product._id,
          bookingDate: formattedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });

        setCapacityInfo(res.result ?? null);
      } catch (err: any) {
        console.error('Capacity fetch error', err);
        setCapacityError(err?.message || 'Unable to fetch capacity');
        setCapacityInfo(null);
      } finally {
        setCapacityLoading(false);
      }
    };

    fetchCapacity();
  }, [selectedDate, selectedSlotId, formattedDate, product.defaultSlots, product._id]);

  const validateSelection = () => {
    let isValid = true;

    if (!selectedDate) {
      setDateError('Please select a date before continuing.');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!selectedSlotId) {
      setSlotError('Please select a time slot before continuing.');
      isValid = false;
    } else {
      setSlotError('');
    }

    return isValid;
  };

  const handleCheck = async (destination: 'cart' | 'checkout') => {
    if (!validateSelection()) return false;

    setAvailabilityError('');

    const bookingData: BookingData = {
      userId,
      bookingType: 'pottery',
      workshopId: product._id,
      optionId: product.options?.[0]?._id || '',
      bookingDate: formattedDate,
      slotId: selectedSlotId!,
      people: quantity,
    };

    const availabilityData: Availability = {
      workshopId: product._id,
      bookingDate: formattedDate,
      slotId: selectedSlotId!,
      guests: quantity,
    };

    const availabilityResponse = await getAvailabilityData(availabilityData);
    const isAvailable = availabilityResponse?.result?.available === true;
    const isAvailableMessage = availabilityResponse?.result?.reason;

    if (!isAvailable) {
      setAvailabilityError(isAvailableMessage || 'Selected slot is not available. Please choose another date or time.');
      return false;
    }

    setAvailabilityError('');

    try {
      await bookingService.addToCart(bookingData);
      return true;
    } catch (error) {
      setAvailabilityError((error as Error)?.message || 'Unable to add booking to cart. Please try again.');
      return false;
    }
  };

  const handleAddToCart = async () => {
    const token: string | null = useAuthStore.getState().user?.token || null;
    if (!token) {
      router.push('/login');
      return;
    }
    const success = await handleCheck('cart');
    if (success) router.push('/cart');
  };

  const handleBookNow = async () => {
    const token: string | null = useAuthStore.getState().user?.token || null;
    if (!token) {
      router.push('/login');
      return;
    }
    const success = await handleCheck('checkout');
    if (success) router.push('/checkout');
  };

  const isBookingDisabled =
    !selectedDate ||
    !selectedSlotId ||
    quantity <= 0 ||
    (capacityInfo?.remainingCapacity !== undefined && quantity > capacityInfo.remainingCapacity);

  return (
    <section className="bg-[#f5f1eb] min-h-screen py-12 font-sans text-[#113224]">
      <div className="page-wrapper px-[17px]  grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col gap-4 h-full">
          <div className="w-full aspect-[4/3] bg-gray-200 overflow-hidden relative">
            <img
              src={product?.bannerImage || '/images/product/kids-birthday-1.png'}
              alt="Kids celebrating birthday with cake"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
              <img src={product?.images[0]?.image || '/images/product/kids-birthday-2.jpg'} alt="Party scene 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
              <img src={product?.images[1]?.image || '/images/product/kids-birthday-3.jpg'} alt="Party scene 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
              <img src={product?.images[2]?.image || '/images/product/kids-birthday-4.png'} alt="Party scene 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h1 className="text-[2.5rem] leading-tight font-neiko text-[#113224] mb-1">{product.title}</h1>
            <h2 className="text-[2rem] font-neiko text-[#113224] mb-4">{type === 'kids' ? '(3 - 13 Years)' : '(above 18 Years)'}</h2>
            <p className="text-sm text-gray-800 leading-relaxed pr-4">
              Celebrate your kid's birthday at Bedia Pottery Studio! Enjoy a fun pottery experience in a serene setting. This booking is for a minimum of 12 kids. If you have more, we'll help accommodate.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm">
              <div className="flex gap-2 mb-4 flex-wrap">
                {product.moreDetails?.map((detail) => (
                  <button
                    key={detail._id}
                    onClick={() => setActiveTab(detail._id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === detail._id ? 'bg-[#113224] text-white' : 'bg-[#e9eceb] text-[#113224] hover:bg-[#dce1df]'}`}
                  >
                    {detail.title}
                  </button>
                ))}

                <button
                  onClick={() => setActiveTab('package')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'package' ? 'bg-[#113224] text-white' : 'bg-[#e9eceb] text-[#113224] hover:bg-[#dce1df]'}`}
                >
                  Package Includes
                </button>
              </div>

              <div className="bg-[#fcfcfa] border border-[#e5e5e5] max-h-72 overflow-y-auto  p-6 relative">
                {activeTab === 'package' ? (
                  <ul className="list-disc pl-5 space-y-4 text-[13px] text-gray-700 pr-8">{product.includes?.map((item) => <li key={item._id}>{item.title}</li>)}</ul>
                ) : (
                  <div className="pr-8">
                    <ul className="list-disc pl-5 space-y-4 text-[13px] text-gray-700 pr-8">
                      {activeContent?.description?.split('.').filter((item: string) => item.trim() !== '').map((item: string, index: Key | null | undefined) => <li key={index}>{item.trim()}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="p-[18px] bg-white">
              {product?.options && product.options.length > 0 && type === 'adults' && (
                <MaterialSelector materials={product?.options} selectedMaterialId={selectedMaterialId} onMaterialSelect={setSelectedMaterialId} />
              )}
              {selectedMaterial && selectedMaterial.description && <MaterialDescription materialName={selectedMaterial.title} description={selectedMaterial.description} />}
            </div>

            <div className="p-[18px] bg-white space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Choose Your Make Type</h3>
              {type === 'adults' && (
                <div className="grid grid-cols-2 gap-3">
                  {makeTypes.map((t) => (
                    <button key={t.id} onClick={() => setMakeType(t.id)} className={`px-4 py-3 font-medium transition-colors duration-200 ${makeType === t.id ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-[18px] bg-white">
              <DateSelector onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              {dateError && <p className="mt-3 text-sm text-red-600">{dateError}</p>}
            </div>

            {product?.defaultSlots.length > 0 && (
              <div className="p-[18px] bg-white">
                <TimeSlotSelector slots={product.defaultSlots.map((slot) => ({ ...slot, capacity: Boolean(slot.capacity) }))} selectedSlotId={selectedSlotId} onSlotSelect={handleSlotSelect} />
                {slotError && <p className="mt-3 text-sm text-red-600">{slotError}</p>}

                {capacityLoading && <p className="mt-3 text-sm text-gray-600">Checking capacity...</p>}
                {capacityError && <p className="mt-3 text-sm text-red-600">{capacityError}</p>}
                {capacityInfo && (capacityInfo.remainingCapacity === 0 ? (
                  <p className="mt-3 text-sm text-red-600">Sorry, this time slot is fully booked. Please select another time slot or date.</p>
                ) : (
                  <div className="mt-3 text-sm text-green-700">
                    <p>
                      <strong>Available stock:</strong> {capacityInfo.remainingCapacity}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="p-[18px] bg-white">
              <QuantitySelector
                quantity={quantity}
                limit={quantityLimit}
                onIncrease={() => {
                  if (quantity < quantityLimit) setQuantity(quantity + 1);
                }}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                unitPrice={selectedMaterial ? selectedMaterial.price : 0}
                currency={selectedMaterial ? selectedMaterial.currency : 'AED'}
                onCart={handleAddToCart}
              />
            </div>

            {availabilityError && <p className="text-sm text-red-600">{availabilityError}</p>}
            <BookingActions onBookNow={handleBookNow} isBookingDisabled={isBookingDisabled} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BirthdayHero;
