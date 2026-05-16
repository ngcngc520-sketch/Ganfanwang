import type { Metadata, Viewport } from 'next'
import { Noto_Sans_TC, Inter } from 'next/font/google'
import './globals.css'

const notoSansTC = Noto_Sans_TC({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: '幹飯王 — 今日炫什麼',
  description: '用最少的錢，吃最合理的一天。智慧規劃你的三餐預算，找到最划算的美食組合。',
  keywords: ['預算', '省錢', '美食', '三餐', '學生', '台灣', '幹飯王'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: '幹飯王 — 今日炫什麼',
    description: '用最少的錢，吃最合理的一天',
    type: 'website',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className="bg-background">
      <body className={`${notoSansTC.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
