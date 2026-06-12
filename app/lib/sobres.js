import { equipos } from './equipos'

const RANGOS = {
  bronce:  { '70-79': 0.70, '80-84': 0.20, '85-89': 0.08, '90+': 0.02 },
  plata:   { '70-79': 0.30, '80-84': 0.40, '85-89': 0.20, '90+': 0.10 },
  oro:     { '70-79': 0.10, '80-84': 0.25, '85-89': 0.40, '90+': 0.25 },
  elite:   { '70-79': 0.05, '80-84': 0.15, '85-89': 0.35, '90+': 0.45 }
}

const CARTAS_POR_SOBRE = {
  bronce: 3,
  plata: 3,
  oro: 4,
  elite: 5
}

export function getTipoSobre(media) {
  if (media >= 93) return 'elite'
  if (media >= 89) return 'oro'
  if (media >= 82) return 'plata'
  return 'bronce'
}

function sortearRango(tipoSobre) {
  const rangos = RANGOS[tipoSobre]
  const r = Math.random()
  let acumulado = 0
  for (const [rango, prob] of Object.entries(rangos)) {
    acumulado += prob
    if (r <= acumulado) return rango
  }
  return '70-79'
}

function getJugadoresPorRango(rango) {
  const todosJugadores = equipos.flatMap(e =>
    e.jugadores.map(j => ({ ...j, equipo: e.nombre }))
  )

  return todosJugadores.filter(j => {
    if (rango === '70-79') return j.valoracion >= 70 && j.valoracion <= 79
    if (rango === '80-84') return j.valoracion >= 80 && j.valoracion <= 84
    if (rango === '85-89') return j.valoracion >= 85 && j.valoracion <= 89
    if (rango === '90+')   return j.valoracion >= 90
    return false
  })
}

function sortearJugadorConPeso(jugadores) {
  const minVal = Math.min(...jugadores.map(j => j.valoracion))
  const pesos = jugadores.map(j => Math.pow(0.7, j.valoracion - minVal))
  const totalPeso = pesos.reduce((a, b) => a + b, 0)

  const r = Math.random() * totalPeso
  let acumulado = 0
  for (let i = 0; i < jugadores.length; i++) {
    acumulado += pesos[i]
    if (r <= acumulado) return jugadores[i]
  }
  return jugadores[0]
}

export function generarSobre(tipoSobre) {
  const numCartas = CARTAS_POR_SOBRE[tipoSobre]
  const cartasGeneradas = []
  const idsUsados = new Set()

  let intentos = 0
  while (cartasGeneradas.length < numCartas && intentos < 100) {
    intentos++
    const rango = sortearRango(tipoSobre)
    const jugadoresRango = getJugadoresPorRango(rango)
    if (jugadoresRango.length === 0) continue

    const jugador = sortearJugadorConPeso(jugadoresRango)
    if (idsUsados.has(jugador.jugador_real_id)) continue

    idsUsados.add(jugador.jugador_real_id)
    cartasGeneradas.push({
      jugador_real_id: jugador.jugador_real_id,
      nombre: jugador.nombre,
      valoracion: jugador.valoracion,
      posicion: jugador.posicion,
      equipo: jugador.equipo,
      nacionalidad: jugador.nacionalidad || null
    })
  }

  return cartasGeneradas
}
