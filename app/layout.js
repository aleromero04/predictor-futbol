import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Champions Draft — Construye tu once histórico',
  description: 'Elige jugadores de los mejores equipos campeones de la Champions League y construye el once perfecto. Compite en el ranking global.',
  keywords: 'champions league, draft, fútbol, once histórico, juego fútbol',
  openGraph: {
    title: 'Champions Draft — Construye tu once histórico',
    description: 'Elige jugadores de los mejores equipos campeones de la Champions League y construye el once perfecto.',
    url: 'https://predictor-futbol-three.vercel.app',
    siteName: 'Champions Draft',
    images: [
  {
    url: 'https://predictor-futbol-three.vercel.app/og-image.png',
    width: 851,
    height: 315,
    alt: 'Champions Draft'
  }
],
    locale: 'es_ES',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Champions Draft — Construye tu once histórico',
    description: 'Elige jugadores de los mejores equipos campeones de la Champions League y construye el once perfecto.',
    images: ['https://predictor-futbol-three.vercel.app/og-image.png']
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}