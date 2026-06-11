'use client'

import { useState, useEffect } from 'react'
import { formaciones, getEquipoAleatorio, getJugadoresCompatibles, compatibilidad } from '../lib/equipos'
import { createClient } from '../lib/supabase-client'
import { getPartidaDeHoy } from '../lib/db'

const posicionesLayout = {
  '4-3-3': [
    { pos: 'DC', x: 50, y: 10 },
    { pos: 'EI', x: 20, y: 22 },
    { pos: 'ED', x: 80, y: 22 },
    { pos: 'MC', x: 25, y: 40 },
    { pos: 'MCD', x: 50, y: 42 },
    { pos: 'MC', x: 75, y: 40 },
    { pos: 'LI', x: 10, y: 62 },
    { pos: 'DFC', x: 32, y: 65 },
    { pos: 'DFC', x: 68, y: 65 },
    { pos: 'LD', x: 90, y: 62 },
    { pos: 'POR', x: 50, y: 82 },
  ],
  '4-2-3-1': [
    { pos: 'DC', x: 50, y: 10 },
    { pos: 'EI', x: 15, y: 28 },
    { pos: 'MC', x: 50, y: 28 },
    { pos: 'ED', x: 85, y: 28 },
    { pos: 'MCD', x: 33, y: 48 },
    { pos: 'MCD', x: 67, y: 48 },
    { pos: 'LI', x: 10, y: 65 },
    { pos: 'DFC', x: 32, y: 65 },
    { pos: 'DFC', x: 68, y: 65 },
    { pos: 'LD', x: 90, y: 65 },
    { pos: 'POR', x: 50, y: 82 },
  ],
  '4-4-2': [
    { pos: 'DC', x: 35, y: 10 },
    { pos: 'DC', x: 65, y: 10 },
    { pos: 'MI', x: 10, y: 38 },
    { pos: 'MC', x: 35, y: 38 },
    { pos: 'MC', x: 65, y: 38 },
    { pos: 'MD', x: 90, y: 38 },
    { pos: 'LI', x: 10, y: 65 },
    { pos: 'DFC', x: 32, y: 65 },
    { pos: 'DFC', x: 68, y: 65 },
    { pos: 'LD', x: 90, y: 65 },
    { pos: 'POR', x: 50, y: 82 },
  ],
  '5-3-2': [
    { pos: 'DC', x: 35, y: 10 },
    { pos: 'DC', x: 65, y: 10 },
    { pos: 'MCD', x: 20, y: 38 },
    { pos: 'MC', x: 50, y: 35 },
    { pos: 'MCD', x: 80, y: 38 },
    { pos: 'LI', x: 5, y: 62 },
    { pos: 'DFC', x: 25, y: 65 },
    { pos: 'DFC', x: 50, y: 67 },
    { pos: 'DFC', x: 75, y: 65 },
    { pos: 'LD', x: 95, y: 62 },
    { pos: 'POR', x: 50, y: 82 },
  ]
}

function getValoracion(media) {
  if (media >= 95) return { texto: 'Equipo Legendario', emoji: '👑', color: 'text-purple-400' }
  if (media >= 90) return { texto: 'Equipo de Élite', emoji: '⭐', color: 'text-yellow-400' }
  if (media >= 85) return { texto: 'Equipo Top', emoji: '🔥', color: 'text-orange-400' }
  if (media >= 80) return { texto: 'Equipo Sólido', emoji: '💪', color: 'text-blue-400' }
  if (media >= 75) return { texto: 'Equipo Competitivo', emoji: '👍', color: 'text-green-400' }
  return { texto: 'Equipo de Transición', emoji: '😅', color: 'text-gray-400' }
}

function ResultadoPanel({ once, media, formacion, onReset }) {
  const [copiado, setCopiado] = useState(false)
  const valoracion = getValoracion(media)
  const jugadores = Object.values(once)

  const compartir = () => {
    const linea = jugadores.map(j => `${j.nombre} (${j.valoracion})`).join(' · ')
    const texto = `⚽ Champions Draft\n${valoracion.emoji} ${valoracion.texto} — Media: ${media}\n📋 ${formacion}: ${linea}\n\n¿Puedes superarme?`
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Cabecera resultado */}
      <div className="text-center py-4">
        <p className="text-5xl mb-2">{valoracion.emoji}</p>
        <p className={`text-2xl font-bold ${valoracion.color}`}>{valoracion.texto}</p>
        <p className="text-6xl font-bold mt-2">{media}</p>
        <p className="text-gray-400 text-sm">Media del equipo · {formacion}</p>
      </div>

      {/* Lista de jugadores */}
      <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
        {jugadores.map((j, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-700 rounded-lg px-3 py-1.5">
            <span className="font-medium text-sm">{j.nombre}</span>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-400">{j.posicion}</span>
              <span className="bg-yellow-500 text-gray-900 font-bold text-sm px-2 py-0.5 rounded">
                {j.valoracion}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="space-y-2 pt-2">
        <button
          onClick={compartir}
          className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl transition-colors"
        >
          {copiado ? '✓ Copiado al portapapeles' : '📤 Compartir resultado'}
        </button>
        <button
          onClick={onReset}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Jugar de nuevo
        </button>
      </div>
    </div>
  )
}

export default function Game() {
  const [equipo, setEquipo] = useState(() => getEquipoAleatorio())
  const [formacionElegida, setFormacionElegida] = useState(null)
  const [once, setOnce] = useState({})
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null)
  const [jugadoresUsados, setJugadoresUsados] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [partidaDeHoy, setPartidaDeHoy] = useState(null)
  const [comprobando, setComprobando] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUsuario = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUsuario(user)

        if (user) {
            const partida = await getPartidaDeHoy(user.id)
            setPartidaDeHoy(partida)
        }
        setComprobando(false)
    }
        getUsuario()
    }, [])

  const guardarPartida = async (onceFinal, mediaFinal, formacionFinal) => {
    if (!usuario) return

    const jugadores = Object.values(onceFinal).map(j => ({
      nombre: j.nombre,
      posicion: j.posicion,
      valoracion: j.valoracion
    }))

    await supabase.from('partidas').insert({
      user_id: usuario.id,
      formacion: formacionFinal,
      media: mediaFinal,
      jugadores: jugadores
    })
  }

  const elegirFormacion = (f) => {
    setFormacionElegida(f)
    setOnce({})
    setJugadorSeleccionado(null)
    setJugadoresUsados([])
  }

  const seleccionarJugador = (jugador) => {
    if (jugadoresUsados.includes(jugador.jugador_real_id)) return
    setJugadorSeleccionado(jugador)
  }

  const colocarEnPosicion = (index) => {
    if (!jugadorSeleccionado) return
    const posRequerida = posicionesLayout[formacionElegida][index].pos
    const compatibles = compatibilidad[posRequerida]
    if (!compatibles.includes(jugadorSeleccionado.posicion)) return
    if (once[index]) return

    const nuevoOnce = { ...once, [index]: jugadorSeleccionado }
    setOnce(nuevoOnce)
    const formacionActual = formacionElegida
    const totalPosiciones = posicionesLayout[formacionElegida].length

    if (Object.keys(nuevoOnce).length === totalPosiciones) {
      const media = Math.round(
        Object.values(nuevoOnce).reduce((acc, j) => acc + j.valoracion, 0) / totalPosiciones
      )
      guardarPartida(nuevoOnce, media, formacionActual)
    }
    setJugadoresUsados(prev => [...prev, jugadorSeleccionado.jugador_real_id])
    setJugadorSeleccionado(null)
    setEquipo(getEquipoAleatorio())
  }

  const posicionesCompatibles = (index) => {
    if (!jugadorSeleccionado) return false
    if (once[index]) return false
    const posRequerida = posicionesLayout[formacionElegida][index].pos
    return compatibilidad[posRequerida].includes(jugadorSeleccionado.posicion)
  }

  const onceLleno = formacionElegida &&
    Object.keys(once).length === posicionesLayout[formacionElegida].length

  const calcularMedia = () => {
    const jugadores = Object.values(once)
    return Math.round(jugadores.reduce((acc, j) => acc + j.valoracion, 0) / jugadores.length)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      {comprobando ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Cargando...</p>
        </div>
      ) : partidaDeHoy ? (
        <div className="max-w-md mx-auto mt-20 bg-gray-800 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">⏳</p>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Ya jugaste hoy</h2>
          <p className="text-gray-400 mb-6">Tu puntuación de hoy: <span className="text-white font-bold text-2xl">{partidaDeHoy.media}</span></p>
          <p className="text-gray-400 text-sm">Vuelve mañana para una nueva partida</p>
          <button
            onClick={() => router.push('/ranking')}
            className="mt-6 bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Ver ranking
          </button>
        </div>
      ) : (
      <>
      <h1 className="text-3xl font-bold text-center mb-6">⚽ Champions Draft</h1>

      {!formacionElegida ? (
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Elige tu formación</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(formaciones).map(f => (
              <button
                key={f}
                onClick={() => elegirFormacion(f)}
                className="bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 
                           font-bold py-4 rounded-lg transition-colors text-lg"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Campo de fútbol */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">{formacionElegida}</h2>
              {onceLleno && (
                <span className="bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full">
                  Media: {calcularMedia()}
                </span>
              )}
              <button
                onClick={() => setFormacionElegida(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cambiar
              </button>
            </div>

            {/* Campo */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #2d5a1b 0%, #3a7a24 25%, #2d5a1b 50%, #3a7a24 75%, #2d5a1b 100%)',
                paddingBottom: '130%'
              }}
            >
              {/* Líneas del campo */}
              <div className="absolute inset-0">
                {/* Círculo central */}
                <div className="absolute rounded-full border-2 border-white opacity-30"
                  style={{ width: '30%', height: '23%', top: '38.5%', left: '35%' }} />
                {/* Línea central */}
                <div className="absolute border-t-2 border-white opacity-30"
                  style={{ width: '100%', top: '50%' }} />
                {/* Área grande arriba */}
                <div className="absolute border-2 border-white opacity-30"
                  style={{ width: '60%', height: '16%', top: '0%', left: '20%' }} />
                {/* Área grande abajo */}
                <div className="absolute border-2 border-white opacity-30"
                  style={{ width: '60%', height: '16%', bottom: '0%', left: '20%' }} />
              </div>

              {/* Jugadores en el campo */}
              {posicionesLayout[formacionElegida].map((slot, index) => (
                <button
                  key={index}
                  onClick={() => colocarEnPosicion(index)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 
                    flex flex-col items-center transition-all
                    ${posicionesCompatibles(index)
                      ? 'scale-110 cursor-pointer'
                      : once[index]
                        ? 'cursor-default'
                        : 'cursor-default opacity-70'
                    }`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold
                    ${once[index]
                      ? 'bg-yellow-500 border-yellow-300 text-gray-900'
                      : posicionesCompatibles(index)
                        ? 'bg-green-400 border-green-200 text-gray-900 animate-pulse'
                        : 'bg-white bg-opacity-20 border-white border-opacity-50 text-white'
                    }`}
                  >
                    {once[index] ? once[index].valoracion : slot.pos}
                  </div>
                  <span className={`text-xs mt-1 font-medium text-center leading-tight max-w-16
                    ${once[index] ? 'text-yellow-300' : 'text-white opacity-80'}`}
                    style={{ fontSize: '0.6rem' }}
                  >
                    {once[index] ? once[index].nombre : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Panel derecho: equipo y jugadores */}
          <div className="bg-gray-800 rounded-xl p-4">
            {!onceLleno ? (
              <>
                <div className="mb-2 flex justify-between items-center">
                    <div>
                        <p className="text-lg font-bold text-yellow-400 leading-tight">{equipo.nombre}</p>
                        <p className="text-gray-400 text-xs">Media {equipo.media} · {equipo.liga}</p>
                    </div>
                </div>

                {jugadorSeleccionado && (
                  <div className="bg-yellow-500 text-gray-900 rounded-lg px-4 py-2 mb-3 text-sm font-medium">
                    ✓ {jugadorSeleccionado.nombre} seleccionado — haz clic en una posición verde
                  </div>
                )}

                <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                  {equipo.jugadores.map(j => {
                    const usado = jugadoresUsados.includes(j.jugador_real_id)
                    const seleccionado = jugadorSeleccionado?.jugador_real_id === j.jugador_real_id
                    return (
                      <button
                        key={j.id}
                        onClick={() => seleccionarJugador(j)}
                        disabled={usado}
                        className={`w-full flex justify-between items-center rounded-lg px-3 py-2 transition-colors text-left
                          ${usado
                            ? 'bg-gray-700 opacity-40 cursor-not-allowed'
                            : seleccionado
                              ? 'bg-yellow-500 text-gray-900'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                      >
                        <span className="font-medium text-sm">{j.nombre}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs opacity-60">{j.posicion}</span>
                          <span className={`font-bold text-sm px-2 py-0.5 rounded
                            ${seleccionado ? 'bg-gray-900 text-yellow-400' : 'bg-gray-600'}`}>
                            {j.valoracion}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <ResultadoPanel
                once={once}
                media={calcularMedia()}
                formacion={formacionElegida}
                onReset={() => {
                  setFormacionElegida(null)
                  setOnce({})
                  setJugadoresUsados([])
                  setJugadorSeleccionado(null)
                  setEquipo(getEquipoAleatorio())
                }}
              />
            )}
          </div>
        </div>
      )}
      </>
      )}
    </main>
  )
}