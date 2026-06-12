import { createClient } from '../lib/supabase-server'
import { redirect } from 'next/navigation'
import { getSBCsDisponibles } from '../lib/sbcs'
import SBCPanel from '../components/SBCPanel'

export default async function SBCsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sbcsCompletados } = await supabase
    .from('sbcs_completados')
    .select('sbc_id')
    .eq('user_id', user.id)

  const { data: cartas } = await supabase
    .from('cartas')
    .select('*')
    .eq('user_id', user.id)

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('monedas')
    .eq('id', user.id)
    .single()

  const sbcs = getSBCsDisponibles(sbcsCompletados || [])

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">⚡ Squad Building Challenges</h1>
        <p className="text-gray-400 mb-8">Entrega cartas de tu colección para conseguir recompensas</p>

        <SBCPanel
          sbcs={sbcs}
          cartas={cartas || []}
          userId={user.id}
          monedasIniciales={perfil?.monedas || 0}
        />
      </div>
    </main>
  )
}