import { supabase } from './supabase'

export async function getEstadisticasGlobales() {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const { count: partidasHoy } = await supabase
    .from('partidas')
    .select('*', { count: 'exact', head: true })
    .gte('creada_at', hoy.toISOString())

  const { count: totalJugadores } = await supabase
    .from('perfiles')
    .select('*', { count: 'exact', head: true })

  const { data: top3 } = await supabase
    .from('partidas')
    .select('media, formacion, user_id, perfiles(username)')
    .order('media', { ascending: false })
    .limit(3)

  const { data: mejorPartida } = await supabase
    .from('partidas')
    .select('media')
    .order('media', { ascending: false })
    .limit(1)
    .single()

  return {
    partidasHoy: partidasHoy || 0,
    totalJugadores: totalJugadores || 0,
    mejorMarca: mejorPartida?.media || 0,
    top3: top3 || []
  }
}