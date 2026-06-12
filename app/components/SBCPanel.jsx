'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase-client'
import { cartasCumplenRequisito } from '../lib/sbcs'
import { actualizarMonedas } from '../lib/db'
import { generarSobre, getTipoSobre } from '../lib/sobres'
import { guardarCartas } from '../lib/db'
import AperturaSobre from './AperturaSobre'

const COLORES_DIFICULTAD = {
  'fácil': 'bg-green-600',
  'medio': 'bg-yellow-500 text-gray-900',
  'difícil': 'bg-red-600'
}

export default function SBCPanel({ sbcs, cartas, userId, monedasIniciales }) {
  const [monedas, setMonedas] = useState(monedasIniciales)
  const [cartasDisponibles, setCartasDisponibles] = useState(cartas)
  const [sbcsEstado, setSbcsEstado] = useState(sbcs)
  const [sbcActivo, setSbcActivo] = useState(null)
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([])
  const [sobreActual, setSobreActual] = useState(null)
  const [tipoSobreActual, setTipoSobreActual] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const supabase = createClient()

  const toggleCarta = (carta) => {
    const yaSeleccionada = cartasSeleccionadas.find(c => c.id === carta.id)
    if (yaSeleccionada) {
      setCartasSeleccionadas(prev => prev.filter(c => c.id !== carta.id))
    } else {
      setCartasSeleccionadas(prev => [...prev, carta])
    }
  }

  const completarSBC = async () => {
    if (!sbcActivo) return
    if (!cartasCumplenRequisito(cartasSeleccionadas, sbcActivo.requisitos)) {
      setMensaje('Las cartas seleccionadas no cumplen los requisitos')
      return
    }

    // Borrar cartas entregadas
    const idsABorrar = cartasSeleccionadas.map(c => c.id)
    await supabase.from('cartas').delete().in('id', idsABorrar)

    // Marcar SBC como completado
    await supabase.from('sbcs_completados').insert({
      user_id: userId,
      sbc_id: sbcActivo.id
    })

    // Dar recompensas
    let nuevasMonedas = monedas
    if (sbcActivo.recompensa.monedas > 0) {
      nuevasMonedas = await actualizarMonedas(userId, sbcActivo.recompensa.monedas, supabase)
      setMonedas(nuevasMonedas)
    }

    if (sbcActivo.recompensa.sobre) {
      const tipo = sbcActivo.recompensa.sobre
      const cartasNuevas = generarSobre(tipo)
      await guardarCartas(userId, cartasNuevas, supabase)
      setSobreActual(cartasNuevas)
      setTipoSobreActual(tipo)
    }

    // Actualizar estado local
    setCartasDisponibles(prev => prev.filter(c => !idsABorrar.includes(c.id)))
    setSbcsEstado(prev => prev.map(s =>
      s.id === sbcActivo.id ? { ...s, completado: true } : s
    ))
    setCartasSeleccionadas([])
    setSbcActivo(null)
    setMensaje('¡SBC completado!')
  }

  const sbcsFaciles = sbcsEstado.filter(s => s.dificultad === 'fácil')
  const sbcsMedios = sbcsEstado.filter(s => s.dificultad === 'medio')
  const sbcsDificiles = sbcsEstado.filter(s => s.dificultad === 'difícil')

  return (
    <div>
      {/* Monedas */}
      <div className="flex justify-end mb-6">
        <span className="bg-gray-800 rounded-full px-6 py-2 text-yellow-400 font-bold">
          🪙 {monedas} monedas
        </span>
      </div>

      {mensaje && (
        <div className="bg-green-800 rounded-xl p-3 text-center mb-6">
          <p className="text-green-300 font-medium">{mensaje}</p>
        </div>
      )}

      {/* Lista de SBCs */}
      {!sbcActivo ? (
        <div className="space-y-8">
          {[
            { titulo: '🟢 Fáciles', lista: sbcsFaciles },
            { titulo: '🟡 Medios', lista: sbcsMedios },
            { titulo: '🔴 Difíciles', lista: sbcsDificiles }
          ].map(({ titulo, lista }) => (
            <div key={titulo}>
              <h2 className="text-xl font-bold mb-3">{titulo}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lista.map(sbc => (
                  <div
                    key={sbc.id}
                    className={`bg-gray-800 rounded-xl p-5 border transition-all
                      ${sbc.completado
                        ? 'border-green-600 opacity-60'
                        : 'border-gray-700 hover:border-yellow-500 cursor-pointer'
                      }`}
                    onClick={() => !sbc.completado && setSbcActivo(sbc)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{sbc.nombre}</h3>
                      {sbc.completado
                        ? <span className="text-green-400 text-sm font-bold">✓ Completado</span>
                        : <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${COLORES_DIFICULTAD[sbc.dificultad]}`}>
                            {sbc.dificultad}
                          </span>
                      }
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{sbc.descripcion}</p>
                    <div className="flex gap-2 flex-wrap">
                      {sbc.recompensa.monedas > 0 && (
                        <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                          🪙 {sbc.recompensa.monedas}
                        </span>
                      )}
                      {sbc.recompensa.sobre && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full text-white
                          ${sbc.recompensa.sobre === 'elite' ? 'bg-purple-600' :
                            sbc.recompensa.sobre === 'oro' ? 'bg-yellow-600' :
                            sbc.recompensa.sobre === 'plata' ? 'bg-gray-400 text-gray-900' :
                            'bg-amber-700'}`}>
                          📦 Sobre {sbc.recompensa.sobre}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vista de completar SBC */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <button
              onClick={() => { setSbcActivo(null); setCartasSeleccionadas([]) }}
              className="text-gray-400 hover:text-white text-sm mb-4"
            >
              ← Volver
            </button>
            <div className="bg-gray-800 rounded-xl p-5 mb-4">
              <h2 className="text-xl font-bold mb-1">{sbcActivo.nombre}</h2>
              <p className="text-gray-400 text-sm mb-3">{sbcActivo.descripcion}</p>
              <div className="flex gap-2">
                {sbcActivo.recompensa.monedas > 0 && (
                  <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                    🪙 {sbcActivo.recompensa.monedas}
                  </span>
                )}
                {sbcActivo.recompensa.sobre && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full text-white
                    ${sbcActivo.recompensa.sobre === 'elite' ? 'bg-purple-600' :
                      sbcActivo.recompensa.sobre === 'oro' ? 'bg-yellow-600' :
                      sbcActivo.recompensa.sobre === 'plata' ? 'bg-gray-400 text-gray-900' :
                      'bg-amber-700'}`}>
                    📦 Sobre {sbcActivo.recompensa.sobre}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-5">
              <h3 className="font-bold mb-2">
                Cartas seleccionadas: {cartasSeleccionadas.length}/{sbcActivo.requisitos.cantidad}
              </h3>
              {cartasSeleccionadas.length === 0 ? (
                <p className="text-gray-400 text-sm">Selecciona cartas de tu colección</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {cartasSeleccionadas.map((c, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-2 text-center text-xs">
                      <p className="font-bold">{c.nombre}</p>
                      <p className="text-gray-400">{c.valoracion}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={completarSBC}
                disabled={!cartasCumplenRequisito(cartasSeleccionadas, sbcActivo.requisitos)}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl
                           hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Completar SBC
              </button>
            </div>
          </div>

          {/* Colección para seleccionar */}
          <div className="bg-gray-800 rounded-xl p-5">
            <h3 className="font-bold mb-3">Tu colección</h3>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {cartasDisponibles.map((carta, i) => {
                const seleccionada = cartasSeleccionadas.find(c => c.id === carta.id)
                return (
                  <button
                    key={i}
                    onClick={() => toggleCarta(carta)}
                    className={`rounded-xl p-2 text-center text-xs transition-all border-2
                      ${seleccionada
                        ? 'border-yellow-500 bg-gray-600'
                        : 'border-transparent bg-gray-700 hover:bg-gray-600'
                      }`}
                  >
                    <div className={`rounded-lg py-1 mb-1 ${
                      carta.valoracion >= 95 ? 'bg-purple-500' :
                      carta.valoracion >= 90 ? 'bg-blue-500' :
                      carta.valoracion >= 85 ? 'bg-green-600' :
                      carta.valoracion >= 80 ? 'bg-green-400' :
                      carta.valoracion >= 75 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}>
                      <p className="text-white font-black">{carta.valoracion}</p>
                    </div>
                    <p className="font-bold text-white leading-tight truncate">{carta.nombre}</p>
                    <p className="text-gray-400">{carta.posicion}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {sobreActual && (
        <AperturaSobre
          cartas={sobreActual}
          tipoSobre={tipoSobreActual}
          onCerrar={() => {
            setSobreActual(null)
            setTipoSobreActual(null)
          }}
        />
      )}
    </div>
  )
}