export const SBCS = [
  {
    id: 1,
    nombre: "Primeros pasos",
    descripcion: "Entrega 2 cartas de cualquier tipo",
    dificultad: "fácil",
    requisitos: {
      tipo: "cantidad_total",
      cantidad: 2
    },
    recompensa: { monedas: 50, sobre: null }
  },
  {
    id: 2,
    nombre: "Cantera española",
    descripcion: "Entrega 3 jugadores españoles",
    dificultad: "fácil",
    requisitos: {
      tipo: "nacionalidad",
      nacionalidad: "España",
      cantidad: 3
    },
    recompensa: { monedas: 0, sobre: "bronce" }
  },
  {
    id: 3,
    nombre: "Los porteros",
    descripcion: "Entrega 2 porteros",
    dificultad: "fácil",
    requisitos: {
      tipo: "posicion",
      posicion: "POR",
      cantidad: 2
    },
    recompensa: { monedas: 75, sobre: null }
  },
  {
    id: 4,
    nombre: "Calidad garantizada",
    descripcion: "Entrega 3 jugadores con valoración 80 o más",
    dificultad: "fácil",
    requisitos: {
      tipo: "valoracion_minima",
      valoracion: 80,
      cantidad: 3
    },
    recompensa: { monedas: 0, sobre: "bronce" }
  },
  {
    id: 5,
    nombre: "Galácticos",
    descripcion: "Entrega 4 jugadores del Real Madrid (cualquier año)",
    dificultad: "medio",
    requisitos: {
      tipo: "club",
      club: "Real Madrid",
      cantidad: 4
    },
    recompensa: { monedas: 0, sobre: "plata" }
  },
  {
    id: 6,
    nombre: "La Masia",
    descripcion: "Entrega 4 jugadores del Barcelona (cualquier año)",
    dificultad: "medio",
    requisitos: {
      tipo: "club",
      club: "Barcelona",
      cantidad: 4
    },
    recompensa: { monedas: 0, sobre: "plata" }
  },
  {
    id: 7,
    nombre: "Premier Power",
    descripcion: "Entrega 4 jugadores ingleses",
    dificultad: "medio",
    requisitos: {
      tipo: "nacionalidad",
      nacionalidad: "Inglaterra",
      cantidad: 4
    },
    recompensa: { monedas: 0, sobre: "plata" }
  },
  {
    id: 8,
    nombre: "Los Cracks",
    descripcion: "Entrega 3 jugadores con valoración 90 o más",
    dificultad: "medio",
    requisitos: {
      tipo: "valoracion_minima",
      valoracion: 90,
      cantidad: 3
    },
    recompensa: { monedas: 100, sobre: "oro" }
  },
  {
    id: 9,
    nombre: "Línea defensiva",
    descripcion: "Entrega 4 defensas (DFC, LD o LI)",
    dificultad: "medio",
    requisitos: {
      tipo: "posiciones_multiples",
      posiciones: ["DFC", "LD", "LI"],
      cantidad: 4
    },
    recompensa: { monedas: 0, sobre: "plata" }
  },
  {
    id: 10,
    nombre: "Los Mejores",
    descripcion: "Entrega 5 jugadores con valoración 90 o más",
    dificultad: "difícil",
    requisitos: {
      tipo: "valoracion_minima",
      valoracion: 90,
      cantidad: 5
    },
    recompensa: { monedas: 0, sobre: "elite" }
  },
  {
    id: 11,
    nombre: "Historia del Milan",
    descripcion: "Entrega 6 jugadores del Milan (cualquier año)",
    dificultad: "difícil",
    requisitos: {
      tipo: "club",
      club: "Milan",
      cantidad: 6
    },
    recompensa: { monedas: 200, sobre: "oro" }
  },
  {
    id: 12,
    nombre: "La Remontada",
    descripcion: "Entrega el equipo completo del Liverpool 2005",
    dificultad: "difícil",
    requisitos: {
      tipo: "equipo_completo",
      equipo: "Liverpool 2005",
      cantidad: 15
    },
    recompensa: { monedas: 500, sobre: "elite" }
  },
  {
    id: 13,
    nombre: "Los Galácticos II",
    descripcion: "Entrega 8 jugadores del Real Madrid (cualquier año)",
    dificultad: "difícil",
    requisitos: {
      tipo: "club",
      club: "Real Madrid",
      cantidad: 8
    },
    recompensa: { monedas: 100, sobre: "oro" }
  },
  {
    id: 14,
    nombre: "Leyendas",
    descripcion: "Entrega 3 jugadores con valoración 95 o más",
    dificultad: "difícil",
    requisitos: {
      tipo: "valoracion_minima",
      valoracion: 95,
      cantidad: 3
    },
    recompensa: { monedas: 500, sobre: "elite" }
  },
  {
    id: 15,
    nombre: "El Equipo del Siglo",
    descripcion: "Entrega 5 jugadores con valoración 95 o más",
    dificultad: "difícil",
    requisitos: {
      tipo: "valoracion_minima",
      valoracion: 95,
      cantidad: 5
    },
    recompensa: { monedas: 2000, sobre: "elite" }
  }
]

export function getSBCsDisponibles(sbcsCompletados) {
  const completadosIds = new Set(sbcsCompletados.map(s => s.sbc_id))
  return SBCS.map(sbc => ({
    ...sbc,
    completado: completadosIds.has(sbc.id)
  }))
}

export function cartasCumplenRequisito(cartas, requisito) {
  switch (requisito.tipo) {
    case 'cantidad_total':
      return cartas.length >= requisito.cantidad

    case 'posicion':
      return cartas.filter(c => c.posicion === requisito.posicion).length >= requisito.cantidad

    case 'posiciones_multiples':
      return cartas.filter(c => requisito.posiciones.includes(c.posicion)).length >= requisito.cantidad

    case 'valoracion_minima':
      return cartas.filter(c => c.valoracion >= requisito.valoracion).length >= requisito.cantidad

    case 'club':
      return cartas.filter(c => c.equipo.includes(requisito.club)).length >= requisito.cantidad

    case 'equipo_completo':
      return cartas.filter(c => c.equipo === requisito.equipo).length >= requisito.cantidad

    case 'nacionalidad':
      return cartas.filter(c => c.nacionalidad === requisito.nacionalidad).length >= requisito.cantidad

    default:
      return false
  }
}