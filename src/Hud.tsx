import { useEffect } from 'react'
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

  useEffect(() => {
    if (dead) document.exitPointerLock()
  }, [dead])

  const start = () => {
    setStarted(true)
    Promise.resolve(document.querySelector('canvas')?.requestPointerLock()).catch(() => {})
  }

  return (
    <div className={`hud ${splatter ? 'splat' : ''}`}>
      <div className="chaos">
        Chaos: {chaos} · Hunde besiegt: {kills}
        <div className="hearts">{Array.from({ length: MAX_HP }, (_, i) => (i < hp ? '❤️' : '🖤')).join(' ')}</div>
      </div>
      {dead && (
        <div className="overlay">
          <h1>Leben verloren!</h1>
          <p>Katzen haben neun Leben. Timmi Tatz hat gerade eines verbraucht.</p>
          <button
            onClick={() => {
              respawn()
              Promise.resolve(document.querySelector('canvas')?.requestPointerLock()).catch(() => {})
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
          WASD Bewegen · Shift Sprinten · Leertaste Springen (Doppelsprung) · Linksklick Kratzen · B Splatter {splatter ? 'an' : 'aus'}
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
