import { createClient } from '../lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: partidas } = await supabase
    .from('partidas')
    .select('id, media, formacion, creada_at, jugadores')
    .eq('user_id', user.id)
    .order('creada_at', { ascending: false })

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const mejorMarca = partidas?.length > 0 ? Math.max(...partidas.map(p => p.media)) : 0
  const mediaGlobal = partidas?.length > 0
    ? Math.round(partidas.reduce((acc, p) => acc + p.media, 0) / partidas.length)
    : 0

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">

        {/* Cabecera perfil */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-2xl font-bold">
              {perfil?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{perfil?.username || 'Usuario'}</h1>
              <p className="text-gray-400 text-sm">{partidas?.length || 0} partidas jugadas</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">{mejorMarca}</p>
              <p className="text-gray-400 text-sm mt-1">Mejor marca</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{mediaGlobal}</p>
              <p className="text-gray-400 text-sm mt-1">Media global</p>
            </div>
          </div>
        </div>

        {/* Historial */}
        <h2 className="text-xl font-bold mb-3">Historial de partidas</h2>
        <div className="space-y-2">
          {partidas?.map((partida, index) => (
            <div key={partida.id} className="bg-gray-800 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{partida.media}</span>
                  {partida.media === mejorMarca && (
                    <span className="text-xs bg-yellow-500 text-gray-900 font-bold px-2 py-0.5 rounded-full">
                      Mejor marca
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">
                  {partida.formacion} · {new Date(partida.creada_at).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="text-right text-sm text-gray-400">
                {partida.jugadores?.slice(0, 3).map((j, i) => (
                  <p key={i}>{j.nombre}</p>
                ))}
                {partida.jugadores?.length > 3 && (
                  <p>+{partida.jugadores.length - 3} más</p>
                )}
              </div>
            </div>
          ))}

          {(!partidas || partidas.length === 0) && (
            <div className="text-center text-gray-400 py-12">
              Aún no has jugado ninguna partida.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}