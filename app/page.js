import Game from './components/Game'
import { getEstadisticasGlobales } from './lib/stats'

export default async function Home() {
  const stats = await getEstadisticasGlobales()
  return <Game stats={stats} />
}