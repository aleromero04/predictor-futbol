'use client'

import { useState } from 'react'

function getColorValoracion(v) {
  if (v >= 95) return 'bg-purple-500'
  if (v >= 90) return 'bg-blue-500'
  if (v >= 85) return 'bg-green-600'
  if (v >= 80) return 'bg-green-400'
  if (v >= 75) return 'bg-yellow-500'
  return 'bg-orange-500'
}

function EquipoAcordeon({ nombre, cartas, conseguidas, total, completo }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
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
            {cartas.map((carta, i) => (
              <div key={i} className="bg-gray-700 rounded-xl p-2 text-center border border-gray-600">
                <div className={`${getColorValoracion(carta.valoracion)} rounded-lg py-1 mb-1`}>
                  <p className="text-white font-black text-base">{carta.valoracion}</p>
                </div>
                <p className="font-bold text-xs text-white leading-tight truncate">{carta.nombre}</p>
                <p className="text-gray-400 text-xs">{carta.posicion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ColeccionAcordeon({ equiposConCartas, totalCartas, cartasUnicas, equiposCompletos }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Mi colección</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-yellow-400">{totalCartas}</p>
          <p className="text-gray-400 text-xs mt-1">Cartas totales</p>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-400">{cartasUnicas}</p>
          <p className="text-gray-400 text-xs mt-1">Jugadores únicos</p>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-purple-400">{equiposCompletos}</p>
          <p className="text-gray-400 text-xs mt-1">Equipos completos</p>
        </div>
      </div>

      {equiposConCartas.length > 0 ? (
        <div className="space-y-2">
          {equiposConCartas.map(({ equipo, cartas, conseguidas, total, completo }) => (
            <EquipoAcordeon
              key={equipo.id}
              nombre={equipo.nombre}
              cartas={cartas}
              conseguidas={conseguidas}
              total={total}
              completo={completo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p className="text-4xl mb-2">🃏</p>
          <p>Aún no tienes cartas. ¡Completa una partida!</p>
        </div>
      )}
    </div>
  )
}
