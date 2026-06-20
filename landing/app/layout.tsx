import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cia Pet — Clínica Veterinária & Banho e Tosa | Lençóis Paulista/SP',
  description:
    'Cuidado especializado para o seu pet. Clínica veterinária, banho e tosa, internação e cirurgias em Lençóis Paulista/SP. Dr. Ighor Morales.',
  keywords: ['veterinário', 'clínica veterinária', 'banho e tosa', 'Lençóis Paulista', 'pet', 'Cia Pet'],
  openGraph: {
    title: 'Cia Pet — Clínica Veterinária',
    description: 'Cuidado especializado para o seu pet em Lençóis Paulista/SP.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#13a89e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
