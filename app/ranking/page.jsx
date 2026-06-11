import { createClient } from '../lib/supabase-server'

export default async function RankingPage() {
  const supabase = await createClient()

  const { data: partidas } = await supabase
    .from('partidas')
    .select('id, media, formacion, creada_at, user_id')
    .order('media', { ascending: false })
    .limit(50)

  // Obtener usernames de los perfiles
  const userIds = [...new Set(partidas?.map(p => p.user_id) || [])]
  
  const { data: perfiles } = await supabase
    .from('perfiles')
    .select('id, username')
    .in('id', userIds)

  const perfilesMap = {}
  perfiles?.forEach(p => { perfilesMap[p.id] = p.username })

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">🏆 Ranking Global</h1>
        <p className="text-gray-400 text-center mb-8">Las mejores puntuaciones de todos los jugadores</p>

        <div className="space-y-2">
          {partidas?.map((partida, index) => {
            const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null
            return (
              <div
                key={partida.id}
                className={`flex items-center gap-4 rounded-xl px-5 py-4
                  ${index === 0 ? 'bg-yellow-500 text-gray-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-gray-800 text-white'}`}
              >
                <span className="font-bold text-lg w-8 text-center">
                  {medalla || `#${index + 1}`}
                </span>
                <div className="flex-1">
                  <p className="font-bold">{perfilesMap[partida.user_id] || 'Anónimo'}</p>
                  <p className={`text-sm ${index < 3 ? 'opacity-70' : 'text-gray-400'}`}>
                    {partida.formacion} · {new Date(partida.creada_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className="text-2xl font-bold">{partida.media}</span>
              </div>
            )
          })}

          {(!partidas || partidas.length === 0) && (
            <div className="text-center text-gray-400 py-12">
              Aún no hay partidas. ¡Sé el primero en jugar!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}