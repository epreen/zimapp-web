import { type Metadata } from 'next'
import { ReactNode } from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import AuthInitializer from '@/components/ui/initializers/auth-initializer'
import ThemeInitializer from '@/components/ui/initializers/theme-initializer'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['200', '400', '600']
})

export const metadata: Metadata = {
  metadataBase: new URL("https://zimapp.com"),
  title: {
    template: "%s | ZiMAPP - Premium Online Shopping",
    default: "ZiMAPP - Your Trusted Online Shopping Destination",
  },
  description:
    "Discover amazing products at ZiMAPP, your trusted online shopping destination for quality items and exceptional customer service. Shop electronics, fashion, home goods and more with fast delivery.",
  keywords: [
    "online shopping",
    "e-commerce",
    "buy online",
    "shop online",
    "electronics",
    "fashion",
    "home goods",
    "deals",
    "discounts",
    "ZiMAPP",
  ],
  authors: [{ name: "ZiMAPP" }],
  creator: "ZiMAPP",
  publisher: "ZiMAPP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zimapp.com",
    siteName: "ZiMAPP",
    title: "ZiMAPP - Your Trusted Online Shopping Destination",
    description:
      "Discover amazing products at ZiMAPP, your trusted online shopping destination for quality items and exceptional customer service.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZiMAPP Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZiMAPP - Your Trusted Online Shopping Destination",
    description:
      "Discover amazing products at ZiMAPP, your trusted online shopping destination for quality items and exceptional customer service.",
    images: ["/og-image.jpg"],
    creator: "@ZiMAPP",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
  alternates: {
    canonical: "https://zimapp.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {


  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <AuthInitializer />
        <ThemeInitializer />
        {children}
        <Toaster
          position="bottom-center"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}