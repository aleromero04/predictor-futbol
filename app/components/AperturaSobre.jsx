'use client'

import { useState } from 'react'

const COLORES_SOBRE = {
  bronce: {
    bg: 'from-amber-700 to-amber-500',
    texto: 'text-amber-200',
    nombre: 'Sobre Bronce',
    emoji: '📦'
  },
  plata: {
    bg: 'from-gray-400 to-gray-300',
    texto: 'text-gray-800',
    nombre: 'Sobre Plata',
    emoji: '📦'
  },
  oro: {
    bg: 'from-yellow-500 to-yellow-300',
    texto: 'text-yellow-900',
    nombre: 'Sobre Oro',
    emoji: '📦'
  },
  elite: {
    bg: 'from-purple-700 to-purple-400',
    texto: 'text-purple-100',
    nombre: 'Sobre Élite',
    emoji: '💎'
  }
}

function getColorValoracion(v) {
  if (v >= 95) return 'bg-purple-500'
  if (v >= 90) return 'bg-blue-500'
  if (v >= 85) return 'bg-green-600'
  if (v >= 80) return 'bg-green-400'
  if (v >= 75) return 'bg-yellow-500'
  return 'bg-orange-500'
}

export default function AperturaSobre({ cartas, tipoSobre, onCerrar }) {
  const [fase, setFase] = useState('cerrado') // cerrado → abriendo → revelado
  const [cartasReveladas, setCartasReveladas] = useState([])

  const config = COLORES_SOBRE[tipoSobre]

  const abrirSobre = () => {
    setFase('abriendo')
    // Revelar cartas una a una con delay
    cartas.forEach((carta, i) => {
      setTimeout(() => {
        setCartasReveladas(prev => [...prev, carta])
        if (i === cartas.length - 1) {
          setFase('revelado')
        }
      }, i * 400)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="max-w-lg w-full">

        {/* Fase: sobre cerrado */}
        {fase === 'cerrado' && (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-6 uppercase tracking-wide">¡Has ganado un sobre!</p>
            <button
              onClick={abrirSobre}
              className={`w-48 h-64 mx-auto rounded-2xl bg-gradient-to-b ${config.bg} 
                         flex flex-col items-center justify-center shadow-2xl
                         hover:scale-105 active:scale-95 transition-transform cursor-pointer`}
            >
              <span className="text-6xl mb-4">{config.emoji}</span>
              <span className={`font-black text-lg ${config.texto}`}>{config.nombre}</span>
              <span className={`text-sm mt-2 ${config.texto} opacity-70`}>{cartas.length} cartas</span>
            </button>
            <p className="text-gray-400 text-sm mt-6">Toca el sobre para abrirlo</p>
          </div>
        )}

        {/* Fase: abriendo y revelado */}
        {(fase === 'abriendo' || fase === 'revelado') && (
          <div>
            <p className="text-center text-gray-400 text-sm mb-4 uppercase tracking-wide">
              {config.nombre} — {cartasReveladas.length}/{cartas.length} cartas
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {cartasReveladas.map((carta, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-xl p-3 text-center animate-bounce-once
                             border border-gray-700"
                  style={{ animation: 'fadeInUp 0.3s ease forwards' }}
                >
                  <div className={`${getColorValoracion(carta.valoracion)} rounded-lg py-2 mb-2`}>
                    <p className="text-2xl font-black text-white">{carta.valoracion}</p>
                  </div>
                  <p className="font-bold text-sm text-white leading-tight">{carta.nombre}</p>
                  <p className="text-gray-400 text-xs mt-1">{carta.posicion}</p>
                  <p className="text-gray-500 text-xs truncate">{carta.equipo}</p>
                </div>
              ))}

              {/* Slots vacíos mientras se revelan */}
              {Array.from({ length: cartas.length - cartasReveladas.length }).map((_, i) => (
                <div key={`vacio-${i}`} className="bg-gray-800 rounded-xl p-3 border border-gray-700 
                                                    flex items-center justify-center h-32 animate-pulse">
                  <span className="text-3xl">❓</span>
                </div>
              ))}
            </div>

            {fase === 'revelado' && (
              <button
                onClick={onCerrar}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl
                           hover:bg-yellow-400 transition-colors"
              >
                Ver resultado
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}