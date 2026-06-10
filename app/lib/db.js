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