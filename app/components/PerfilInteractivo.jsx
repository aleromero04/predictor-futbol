'use client'

import { useState } from 'react'
import ColeccionAcordeon from './ColeccionAcordeon'

export default function PerfilInteractivo({
  username, monedasIniciales, partidas, mejorMarca, mediaGlobal, cartasUnicas,
  equipos, equiposConCartas, totalCartas, totalJugadoresUnicos, equiposCompletos, totalEquipos,
  userId
}) {
  const [monedas, setMonedas] = useState(monedasIniciales)
  const [totalCartasState, setTotalCartas] = useState(totalCartas)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      {/* Columna izquierda: perfil + historial */}
      <div className="space-y-6">

        {/* Cabecera perfil */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-2xl font-bold">
              {username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{username || 'Usuario'}</h1>
              <p className="text-gray-400 text-sm">{partidas?.length || 0} partidas jugadas</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-black text-2xl">🪙 {monedas}</p>
              <p className="text-gray-400 text-xs">monedas</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">{mejorMarca}</p>
              <p className="text-gray-400 text-sm mt-1">Mejor marca</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{mediaGlobal}</p>
              <p className="text-gray-400 text-sm mt-1">Media global</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{cartasUnicas}</p>
              <p className="text-gray-400 text-sm mt-1">Cartas únicas</p>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Historial de partidas</h2>
          <div className="space-y-2">
            {partidas?.map((partida) => (
              <div key={partida.id} className="bg-gray-700 rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{partida.media}</span>
                    {partida.media === mejorMarca && (
                      <span className="text-xs bg-yellow-500 text-gray-900 font-bold px-2 py-0.5 rounded-full">
                        Mejor marca
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {partida.formacion} · {new Date(partida.creada_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {partida.jugadores?.slice(0, 3).map((j, i) => (
                    <p key={i}>{j.nombre}</p>
                  ))}
                  {partida.jugadores?.length > 3 && (
                    <p>+{partida.jugadores.length - 3} más</p>
                  )}
                </div>
              </div>
            ))}

            {(!partidas || partidas.length === 0) && (
              <div className="text-center text-gray-400 py-12">
                Aún no has jugado ninguna partida.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Columna derecha: colección */}
      <ColeccionAcordeon
        equipos={equipos}
        equiposConCartas={equiposConCartas}
        totalCartas={totalCartasState}
        cartasUnicas={cartasUnicas}
        totalJugadoresUnicos={totalJugadoresUnicos}
        equiposCompletos={equiposCompletos}
        totalEquipos={totalEquipos}
        userId={userId}
        onVenta={setMonedas}
        onCartaVendida={() => setTotalCartas(prev => prev - 1)}
      />

    </div>
  )
}
