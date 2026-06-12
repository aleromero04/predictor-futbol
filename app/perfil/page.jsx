import { createClient } from '../lib/supabase-server'
import { redirect } from 'next/navigation'
import { getCartas } from '../lib/db'
import { equipos } from '../lib/equipos'
import PerfilInteractivo from '../components/PerfilInteractivo'

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

  const cartasUnicas = new Set(cartas.map(c => c.jugador_real_id)).size
  const totalJugadoresUnicos = new Set(
    equipos.flatMap(e => e.jugadores.map(j => j.jugador_real_id))
  ).size

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
        <PerfilInteractivo
          username={perfil?.username}
          monedasIniciales={perfil?.monedas || 0}
          partidas={partidas || []}
          mejorMarca={mejorMarca}
          mediaGlobal={mediaGlobal}
          cartasUnicas={cartasUnicas}
          equipos={equipos}
          equiposConCartas={equiposConCartas}
          totalCartas={cartas.length}
          totalJugadoresUnicos={totalJugadoresUnicos}
          equiposCompletos={equiposCompletos}
          totalEquipos={equipos.length}
          userId={user.id}
        />
      </div>
    </main>
  )
}
