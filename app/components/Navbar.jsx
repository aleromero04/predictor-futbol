'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [usuario, setUsuario] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUsuario(user)
    }
    getUsuario()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
  <span className="font-bold text-yellow-400 text-lg">⚽ Champions Draft</span>
  <button
    onClick={() => router.push('/')}
    className="text-gray-300 hover:text-white text-sm transition-colors"
  >
    Jugar
  </button>
  <button
    onClick={() => router.push('/ranking')}
    className="text-gray-300 hover:text-white text-sm transition-colors"
  >
    Ranking
  </button>
</div>
      <div className="flex items-center gap-4">
        {usuario ? (
          <>
            <button
              onClick={() => router.push('/perfil')}
              className="text-gray-300 hover:text-yellow-400 text-sm transition-colors font-medium"
            >
              {usuario.user_metadata?.username || usuario.email}
            </button>
            <button
              onClick={cerrarSesion}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="text-sm bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  )
}