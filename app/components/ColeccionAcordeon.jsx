'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase-client'
import { venderCarta, getPrecioVenta, actualizarMonedas } from '../lib/db'

function getColorValoracion(v) {
  if (v >= 95) return 'bg-purple-500'
  if (v >= 90) return 'bg-blue-500'
  if (v >= 85) return 'bg-green-600'
  if (v >= 80) return 'bg-green-400'
  if (v >= 75) return 'bg-yellow-500'
  return 'bg-orange-500'
}

const ordenPosiciones = ['POR', 'LD', 'DFC', 'LI', 'MCD', 'MC', 'MD', 'MI', 'ED', 'EI', 'DC', 'SD']

function agruparYOrdenar(cartas) {
  const grupos = {}
  cartas.forEach(c => {
    if (!grupos[c.jugador_real_id]) {
      grupos[c.jugador_real_id] = { carta: c, cantidad: 1, extraIds: [] }
    } else {
      grupos[c.jugador_real_id].cantidad++
      grupos[c.jugador_real_id].extraIds.push(c.id)
    }
  })
  return Object.values(grupos).sort((a, b) => {
    const ia = ordenPosiciones.indexOf(a.carta.posicion)
    const ib = ordenPosiciones.indexOf(b.carta.posicion)
    const posA = ia === -1 ? ordenPosiciones.length : ia
    const posB = ib === -1 ? ordenPosiciones.length : ib
    if (posA !== posB) return posA - posB
    return b.carta.valoracion - a.carta.valoracion
  })
}

function EquipoAcordeon({ nombre, escudo_url, cartas, conseguidas, total, completo, sinCartas, userId, onVenta, onCartaVendida, supabase }) {
  const [abierto, setAbierto] = useState(false)
  const [cartasLocales, setCartasLocales] = useState(cartas)
  const cartasAgrupadas = agruparYOrdenar(cartasLocales)

  const handleVender = async (cartaId, valoracion) => {
    const precio = getPrecioVenta(valoracion)
    const ok = await venderCarta(userId, cartaId, supabase)
    if (!ok) return
    const nuevasMonedas = await actualizarMonedas(userId, precio, supabase)
    onVenta(nuevasMonedas)
    onCartaVendida()
    setCartasLocales(prev => prev.filter(c => c.id !== cartaId))
  }

  return (
    <div className={`border border-gray-700 rounded-xl overflow-hidden${sinCartas ? ' opacity-50' : ''}`}>
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          {escudo_url && (
            <img
              src={escudo_url}
              alt={nombre}
              className="w-8 h-8 object-contain shrink-0"
            />
          )}
          <span className="font-semibold text-sm text-white truncate">{nombre}</span>
          {completo && (
            <span className="shrink-0 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
              ✓ Completo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-gray-400 text-xs">{conseguidas}/{total} cartas</span>
          <span className="text-gray-400 text-xs">{abierto ? '▲' : '▼'}</span>
        </div>
      </button>

      {abierto && (
        <div className="p-3 bg-gray-800">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {cartasAgrupadas.map(({ carta, cantidad, extraIds }) => (
              <div key={carta.jugador_real_id} className="relative bg-gray-700 rounded-xl p-2 text-center border border-gray-600">
                {cantidad > 1 && (
                  <span className="absolute top-1 right-1 bg-gray-900 text-white text-xs font-bold rounded-full px-1.5">
                    x{cantidad}
                  </span>
                )}
                <div className={`${getColorValoracion(carta.valoracion)} rounded-lg py-1 mb-1`}>
                  <p className="text-white font-black text-base">{carta.valoracion}</p>
                </div>
                <p className="font-bold text-xs text-white leading-tight truncate">{carta.nombre}</p>
                <p className="text-gray-400 text-xs">{carta.posicion}</p>
                {cantidad > 1 && (
                  <button
                    onClick={() => handleVender(extraIds[0], carta.valoracion)}
                    className="mt-1 w-full bg-red-600 hover:bg-red-500 text-white text-xs rounded px-1.5 py-0.5"
                  >
                    Vender +{getPrecioVenta(carta.valoracion)}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ColeccionAcordeon({ equipos, equiposConCartas, totalCartas, cartasUnicas, totalJugadoresUnicos, equiposCompletos, totalEquipos, userId, onVenta, onCartaVendida }) {
  const supabase = createClient()
  const cartasMap = Object.fromEntries(equiposConCartas.map(e => [e.equipo.id, e]))

  const todosOrdenados = [...equipos]
    .sort((a, b) => parseInt(a.temporada) - parseInt(b.temporada))
    .map(equipo => cartasMap[equipo.id] || {
      equipo,
      cartas: [],
      conseguidas: 0,
      total: equipo.jugadores.length,
      completo: false
    })

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Mi colección</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-yellow-400">{totalCartas}</p>
          <p className="text-gray-400 text-xs mt-1">Cartas totales</p>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-400">{cartasUnicas}/{totalJugadoresUnicos}</p>
          <p className="text-gray-400 text-xs mt-1">Jugadores únicos</p>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-purple-400">{equiposCompletos}/{totalEquipos}</p>
          <p className="text-gray-400 text-xs mt-1">Equipos completos</p>
        </div>
      </div>

      <div className="space-y-2">
        {todosOrdenados.map(({ equipo, cartas, conseguidas, total, completo }) => (
          <EquipoAcordeon
            key={equipo.id}
            nombre={equipo.nombre}
            escudo_url={equipo.escudo_url}
            cartas={cartas}
            conseguidas={conseguidas}
            total={total}
            completo={completo}
            sinCartas={conseguidas === 0}
            userId={userId}
            onVenta={onVenta}
            onCartaVendida={onCartaVendida}
            supabase={supabase}
          />
        ))}
      </div>
    </div>
  )
}
