import { useEffect } from 'react'
import { useGame } from './store'

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
  const { chaos, splatter, started, popups, setStarted, toggleSplatter } = useGame()

  const start = () => {
    setStarted(true)
    Promise.resolve(document.querySelector('canvas')?.requestPointerLock()).catch(() => {})
  }

  return (
    <div className={`hud ${splatter ? 'splat' : ''}`}>
      <div className="chaos">Chaos: {chaos}</div>
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
