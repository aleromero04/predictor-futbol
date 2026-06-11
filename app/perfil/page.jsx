import { createClient } from '../lib/supabase-server'
import { redirect } from 'next/navigation'
import { getCartas } from '../lib/db'
import { equipos } from '../lib/equipos'
import ColeccionAcordeon from '../components/ColeccionAcordeon'


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
    .select('username, monedas')
    .eq('id', user.id)
    .single()

  const cartas = await getCartas(user.id, supabase)

  const mejorMarca = partidas?.length > 0 ? Math.max(...partidas.map(p => p.media)) : 0
  const mediaGlobal = partidas?.length > 0
    ? Math.round(partidas.reduce((acc, p) => acc + p.media, 0) / partidas.length)
    : 0

  // Cartas únicas por jugador_real_id
  const cartasUnicas = new Set(cartas.map(c => c.jugador_real_id)).size

  // Agrupar cartas por equipo y calcular progreso
  const unicosPorEquipo = {}
  cartas.forEach(c => {
    if (!unicosPorEquipo[c.equipo]) unicosPorEquipo[c.equipo] = new Set()
    unicosPorEquipo[c.equipo].add(c.jugador_real_id)
  })

  const equiposConCartas = equipos
    .filter(e => unicosPorEquipo[e.nombre]?.size > 0)
    .map(e => {
      const conseguidas = unicosPorEquipo[e.nombre].size
      const total = e.jugadores.length
      return {
        equipo: e,
        cartas: cartas.filter(c => c.equipo === e.nombre),
        conseguidas,
        total,
        completo: conseguidas >= total,
        porcentaje: conseguidas / total
      }
    })
    .sort((a, b) => b.porcentaje - a.porcentaje)

  const equiposCompletos = equiposConCartas.filter(g => g.completo).length

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Columna izquierda: perfil + historial */}
          <div className="space-y-6">

            {/* Cabecera perfil */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-2xl font-bold">
                  {perfil?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{perfil?.username || 'Usuario'}</h1>
                  <p className="text-gray-400 text-sm">{partidas?.length || 0} partidas jugadas</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-black text-2xl">🪙 {perfil?.monedas || 0}</p>
                  <p className="text-gray-400 text-xs">monedas</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-400">{mejorMarca}</p>
                  <p className="text-gray-400 text-sm mt-1">Mejor marca</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-400">{mediaGlobal}</p>
                  <p className="text-gray-400 text-sm mt-1">Media global</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-400">{cartasUnicas}</p>
                  <p className="text-gray-400 text-sm mt-1">Cartas únicas</p>
                </div>
              </div>
            </div>

            {/* Historial */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Historial de partidas</h2>
              <div className="space-y-2">
                {partidas?.map((partida) => (
                  <div key={partida.id} className="bg-gray-700 rounded-xl px-5 py-4 flex items-center gap-4">
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

          </div>

          {/* Columna derecha: colección */}
          <ColeccionAcordeon
            equiposConCartas={equiposConCartas}
            totalCartas={cartas.length}
            cartasUnicas={cartasUnicas}
            equiposCompletos={equiposCompletos}
          />

        </div>
      </div>
    </main>
  )
}