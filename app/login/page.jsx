'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [modo, setModo] = useState('login') // 'login' o 'registro'
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null)

  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/')
      router.refresh()
    }
    setCargando(false)
  }

  const handleRegistro = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (error) {
      setError(error.message)
    } else if (data.user && data.session) {
      router.push('/')
      router.refresh()
    } else {
      setMensajeConfirmacion('Revisa tu email para confirmar tu cuenta.')
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">⚽ Champions Draft</h1>
        <p className="text-gray-400 text-center mb-8">
          {modo === 'login' ? 'Inicia sesión para guardar tus partidas' : 'Crea tu cuenta gratuita'}
        </p>

        {mensajeConfirmacion ? (
          <div className="bg-green-800 rounded-xl p-4 text-center">
            <p className="text-green-300 font-medium">✓ {mensajeConfirmacion}</p>
          </div>
        ) : (
          <form onSubmit={modo === 'login' ? handleLogin : handleRegistro} className="space-y-4">

            {modo === 'registro' && (
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nombre de usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="Tu nombre en el ranking"
                  className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white 
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white 
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {error && (
              <div className="bg-red-900 rounded-xl p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl
                         hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {cargando ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button
            onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError(null) }}
            className="text-yellow-400 hover:text-yellow-300 ml-1 font-medium"
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </main>
  )
}