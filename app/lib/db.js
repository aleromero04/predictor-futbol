import { supabase } from './supabase'

export async function importarPartidos(partidos, competicionId) {
  const partidos_formateados = partidos.map(p => ({
    api_fixture_id: p.fixture.id,
    competicion_id: competicionId,
    equipo_local: p.teams.home.name,
    equipo_visitante: p.teams.away.name,
    fecha: p.fixture.date,
    jornada: p.league.round,
    goles_local: p.goals.home,
    goles_visitante: p.goals.away,
    estado: p.fixture.status.short === 'FT' ? 'finalizado' : 
            p.fixture.status.short === '1H' || p.fixture.status.short === '2H' ? 'en_juego' : 
            'pendiente'
  }))

  const { data, error } = await supabase
    .from('partidos')
    .upsert(partidos_formateados, { onConflict: 'api_fixture_id' })

  if (error) {
    console.error('Error importando partidos:', error)
    return { ok: false, error }
  }

  return { ok: true, cantidad: partidos_formateados.length }
}

export async function getPartidosDB(competicionId) {
  const { data, error } = await supabase
    .from('partidos')
    .select('*')
    .eq('competicion_id', competicionId)
    .order('fecha', { ascending: true })

  if (error) {
    console.error('Error leyendo partidos:', error)
    return []
  }

  return data
}

export async function getPartidaDeHoy(userId) {
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') return null

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const { data } = await supabase
    .from('partidas')
    .select('id, media, formacion, creada_at, jugadores')
    .eq('user_id', userId)
    .gte('creada_at', hoy.toISOString())
    .order('creada_at', { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function getMonedas(userId, supabaseClient) {
  const { data } = await supabaseClient
    .from('perfiles')
    .select('monedas')
    .eq('id', userId)
    .single()

  return data?.monedas || 0
}

export async function actualizarMonedas(userId, cantidad, supabaseClient) {
  const { data: perfil } = await supabaseClient
    .from('perfiles')
    .select('monedas')
    .eq('id', userId)
    .single()

  const monedasActuales = perfil?.monedas || 0
  const nuevasMonedas = Math.max(0, monedasActuales + cantidad)

  await supabaseClient
    .from('perfiles')
    .update({ monedas: nuevasMonedas })
    .eq('id', userId)

  return nuevasMonedas
}

export function calcularMonedas(media) {
  if (media >= 95) return 750
  if (media >= 93) return 400
  if (media >= 90) return 200
  if (media >= 86) return 100
  if (media >= 82) return 50
  if (media >= 78) return 25
  return 10
}

export async function guardarCartas(userId, cartas, supabaseClient) {
  const cartasFormateadas = cartas.map(c => ({
    user_id: userId,
    jugador_real_id: c.jugador_real_id,
    nombre: c.nombre,
    valoracion: c.valoracion,
    posicion: c.posicion,
    equipo: c.equipo
  }))

  const { error } = await supabaseClient
    .from('cartas')
    .insert(cartasFormateadas)

  if (error) {
    console.error('Error guardando cartas:', error)
    return false
  }

  return true
}