import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Champions Draft',
  description: 'Construye tu once histórico de la Champions League',
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