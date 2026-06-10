const API_KEY = process.env.API_FOOTBALL_KEY

export async function getPartidosHoy() {
  const hoy = new Date().toISOString().split('T')[0]
  
  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${hoy}`,
    {
      headers: {
        'x-apisports-key': API_KEY
      }
    }
  )
  
  const data = await response.json()
  return data.response
}

export async function getPartidosPorLiga(ligaId, temporada) {
  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${ligaId}&season=${temporada}`,
    {
      headers: {
        'x-apisports-key': API_KEY
      },
      next: { revalidate: 3600 } // cache de 1 hora
    }
  )
  
  const data = await response.json()
  return data.response
}

export async function getPartidosPorFecha(ligaId, temporada, desde, hasta) {
  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${ligaId}&season=${temporada}&from=${desde}&to=${hasta}`,
    {
      headers: {
        'x-apisports-key': API_KEY
      },
      next: { revalidate: 3600 }
    }
  )
  
  const data = await response.json()
  return data.response
}