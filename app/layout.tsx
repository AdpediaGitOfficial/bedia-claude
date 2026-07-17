import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const neiko = localFont({
  src: '../public/fonts/NeikoRegular-XGMP2.otf',
  variable: '--font-neiko',
  weight: '400',
  display: 'swap',
})

const sunriseHimalaya = localFont({
  src: '../public/fonts/Sunrise Himalaya.otf',
  variable: '--font-sunrise',
  weight: '400',
  display: 'swap',
})

const euclid = localFont({
  src: [
    {
      path: "../public/fonts/Euclid Circular A Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Euclid Circular A Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Euclid Circular A Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Euclid Circular A SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Euclid Circular A Bold.ttf",
      weight: "700",
      style: "normal",
    },

    // Italics
    {
      path: "../public/fonts/Euclid Circular A Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Euclid Circular A Medium Italic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Euclid Circular A SemiBold Italic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Euclid Circular A Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-euclid",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'Bedia Pottery ',
    template: '%s | Bedia Pottery',
  },
  description: 'A Premium Ceramic Studio Offers A Unique Fusion Of Art, Mental Health & Fun!',
    icons: {
    icon: '/logo-fav.svg',
    shortcut: '/logo-fav.svg',
    apple: '/logo-fav.svg',
  },

}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={` ${inter.variable} ${neiko.variable} ${sunriseHimalaya.variable} ${euclid.variable} font-sans`}>
        <ScrollToTop />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}


