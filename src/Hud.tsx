import { useEffect } from 'react'
import { MISSIONS } from './missions'
import { MAX_HP, useGame } from './store'

function PopupItem({ id, text, x, y }: { id: number; text: string; x: number; y: number }) {
  const remove = useGame((s) => s.removePopup)
  useEffect(() => {
    const t = setTimeout(() => remove(id), 800)
    return () => clearTimeout(t)
  }, [id, remove])
  return (
    <div className="popup" style={{ left: `${x}%`, top: `${y}%` }}>
      {text}
    </div>
  )
}

export function Hud() {
  const { chaos, kills, hp, dead, splatter, started, popups, setStarted, toggleSplatter, respawn } = useGame()
  const { missionIndex, stats, subtitle, showWin, dismissWin } = useGame()
  const mission = MISSIONS[missionIndex]

  useEffect(() => {
    if (dead || showWin) document.exitPointerLock()
  }, [dead, showWin])

  const relock = () => Promise.resolve(document.querySelector('canvas')?.requestPointerLock()).catch(() => {})

  const start = () => {
    setStarted(true)
    relock()
  }

  return (
    <div className={`hud ${splatter ? 'splat' : ''}`}>
      <div className="chaos">
        Chaos: {chaos} · Hunde besiegt: {kills}
        <div className="hearts">{Array.from({ length: MAX_HP }, (_, i) => (i < hp ? '❤️' : '🖤')).join(' ')}</div>
      </div>
      {started && (
        <div className="mission">
          <b>{mission ? `Mission ${missionIndex + 1}: ${mission.title}` : 'Alle Missionen erledigt'}</b>
          <div>{mission ? `${mission.goal} (${mission.progress(stats)})` : 'Chaos stiften geht immer weiter.'}</div>
        </div>
      )}
      {subtitle && <div className="subtitle">{subtitle}</div>}
      {showWin && (
        <div className="overlay">
          <h1>Geschafft!</h1>
          <p>Timmi Tatz hat sein Abendessen. Chaos-Punkte: {chaos}</p>
          <button
            onClick={() => {
              dismissWin()
              relock()
            }}
          >
            Weiter Chaos stiften
          </button>
        </div>
      )}
      {dead && (
        <div className="overlay">
          <h1>Leben verloren!</h1>
          <p>Katzen haben neun Leben. Timmi Tatz hat gerade eines verbraucht.</p>
          <button
            onClick={() => {
              respawn()
              relock()
            }}
          >
            Nochmal
          </button>
        </div>
      )}
      {popups.map((p) => (
        <PopupItem key={p.id} {...p} />
      ))}
      {started && (
        <div className="help">
          WASD Bewegen · W gegen Wand klettern · Shift Sprinten · Leertaste Springen (2×) · Linksklick Kratzen · B Splatter {splatter ? 'an' : 'aus'}
        </div>
      )}
      {!started && (
        <div className="overlay">
          <h1>Cat Scratch</h1>
          <p>Timmi Tatz will sein Abendessen zurück. Und Chaos.</p>
          <label>
            <input type="checkbox" checked={splatter} onChange={toggleSplatter} /> Splatter-Effekte (Slapstick-Gewalt)
          </label>
          <button onClick={start}>Spielen</button>
          <small>Maus wird eingefangen · Esc gibt sie frei · Klick auf das Spiel fängt sie wieder ein</small>
        </div>
      )}
    </div>
  )
}
