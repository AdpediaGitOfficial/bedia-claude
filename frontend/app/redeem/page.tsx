import GiftCardHero from "@/components/giftcard/GiftCardHeroCoupon";
import { validateGiftData } from "@/services/gift.service";
import {
  AlertCircle,
  AlertTriangleIcon,
  House,
  Link2Off,
  XCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from 'next/link';
interface RedeemPageProps {
  searchParams: Promise<{
    ref?: string;
  }>;
}

export default async function RedeemPage({ searchParams }: RedeemPageProps) {
  const { ref } = await searchParams;
  if (ref) {
    try {
      const gift = await validateGiftData(ref);

      return (
        <main className="min-h-screen bg-[#fcfbf9] text-[#113224] overflow-hidden">
          <GiftCardHero bookingData={gift} />
        </main>
      );
    } catch (error) {
      return (
        <main className="min-h-screen bg-[#fcfbf9] text-[#113224] overflow-hidden">
          <section className="relative min-h-[calc(100vh-140px)] flex items-center">
            <div className="page-wrapper relative z-10 w-full">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
                {/* Left Info Column */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#e0c4bf] bg-white/70 px-4 py-2 text-sm font-medium shadow-sm">
                    <AlertCircle className="h-4 w-4 text-[#8d2f1b]" />
                    Link Verification Failed
                  </div>

                  <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight tracking-tight">
                    This redemption link is invalid.
                  </h1>

                  <p className="mt-5 max-w-xl text-base sm:text-lg text-gray-600 leading-7">
                    We could not verify your gift information. This can happen
                    if the link has expired, was modified accidentally, or if
                    the voucher has already been completely redeemed.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#113224] px-6 py-3.5 font-medium text-[#113224] transition-colors hover:bg-[#113224] hover:text-white"
                    >
                      <House className="h-4 w-4" />
                      Back to home
                    </Link>
                  </div>
                </div>

                {/* Right Status Card Column */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#fde8e8] to-[#fef2f2] blur-2xl opacity-70 translate-y-6" />

                  <div className="relative rounded-[2rem] border border-red-100 bg-white/80 p-6 sm:p-8 shadow-[0_20px_60px_rgba(127,29,29,0.12)] backdrop-blur">
                    <div className="flex items-center justify-between border-b border-red-100 pb-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-red-500">
                          Link Verification
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                          Voucher Not Found
                        </h2>
                      </div>

                      <div className="h-14 w-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                        <Link2Off className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Checked Date</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium text-red-600">
                          Invalid or Expired Token
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl bg-red-50 border border-red-100 p-5">
                      <p className="text-sm text-gray-700 leading-6">
                        Please double-check the URL sequence provided in your
                        original gift email invitation. If you believe this is a
                        technical error, contact our customer support desk to
                        re-authenticate your workshop booking tokens manually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#d9e6dc] blur-3xl opacity-70" />
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#efe2cc] blur-3xl opacity-70" />
            </div>
          </section>
        </main>
      );
    }
  }
}
