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

  const { data: mejorPartida } = await supabase
    .from('partidas')
    .select('media')
    .order('media', { ascending: false })
    .limit(1)
    .single()

  const { data: top3Partidas } = await supabase
    .from('partidas')
    .select('media, formacion, user_id')
    .order('media', { ascending: false })
    .limit(3)

  const userIds = top3Partidas?.map(p => p.user_id) || []
  const { data: perfiles } = await supabase
    .from('perfiles')
    .select('id, username')
    .in('id', userIds)

  const perfilesMap = {}
  perfiles?.forEach(p => { perfilesMap[p.id] = p.username })

  const top3 = top3Partidas?.map(p => ({
    ...p,
    username: perfilesMap[p.user_id] || 'Anónimo'
  })) || []

  return {
    partidasHoy: partidasHoy || 0,
    totalJugadores: totalJugadores || 0,
    mejorMarca: mejorPartida?.media || 0,
    top3
  }
}
