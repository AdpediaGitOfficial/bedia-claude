import Link from 'next/link';
import { CheckCircle2, ArrowRight, House } from 'lucide-react';

export const metadata = {
	title: 'Payment Successful',
	description: 'Your order was placed successfully.',
};

export default function SuccessPage() {
	return (
		<main className="min-h-screen bg-[#fcfbf9] text-[#113224] overflow-hidden">
			<section className="relative min-h-[calc(100vh-140px)] flex items-center">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#d9e6dc] blur-3xl opacity-70" />
					<div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#efe2cc] blur-3xl opacity-70" />
				</div>

				<div className="page-wrapper relative z-10 py-16 lg:py-24 w-full">
					<div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-[#c8d4cb] bg-white/70 px-4 py-2 text-sm font-medium shadow-sm">
								<CheckCircle2 className="h-4 w-4" />
								Payment completed
							</div>

							<h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight tracking-tight">
								Your booking is confirmed.
							</h1>

							<p className="mt-5 max-w-xl text-base sm:text-lg text-gray-600 leading-7">
								A confirmation email with all the details has been sent to your registered email address. We can't wait to welcome you!
							</p>


							<div className="mt-8 flex flex-col sm:flex-row gap-4">
								<Link
									href="/"
									className="inline-flex items-center justify-center gap-2 rounded-full border border-[#113224] px-6 py-3.5 font-medium text-[#113224] transition-colors hover:bg-[#113224] hover:text-white"
								>
									<House className="h-4 w-4" />
									Back to home
								</Link>
							</div>
						</div>

						<div className="relative">
							
							<div className="relative border border-white/70 bg-white/80 p-6 sm:p-8 shadow-[0_20px_60px_rgba(17,50,36,0.12)] backdrop-blur">
								<div className="flex items-center justify-between ">
									<div>
										{/* <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Order summary</p> */}
										<h2 className="mt-2 text-2xl font-semibold">Thank you</h2>
									</div>
									<div className="h-14 w-14 rounded-full bg-[#113224] text-white flex items-center justify-center">
										<CheckCircle2 className="h-7 w-7" />
									</div>
								</div>

							

								
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

