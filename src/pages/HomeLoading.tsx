import { useEffect, useState } from 'react'
import { ArrowUpRight, Monitor } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import './HomeLoading.css'

export function HomeLoading({ ready, onComplete }: { ready: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress(current => Math.min(ready ? 100 : 95, current + 1))
    }, 18)
    return () => window.clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (!ready || progress < 100) return
    const timeout = window.setTimeout(onComplete, 300)
    return () => window.clearTimeout(timeout)
  }, [ready, progress, onComplete])

  return <motion.div className="home-loading" aria-label="Preparing the interactive workspace" exit={{ opacity: 0 }} transition={{ duration: .55, ease: 'easeOut' }}>
    <div className="home-loading__brand"><span className="home-loading__monogram">AK<span>.</span></span><span>DESK<span>.OS</span></span></div>
    <div className="home-loading__content">
      <div className="home-loading__icon" aria-hidden="true"><Monitor size={43} strokeWidth={1.3} /><span /></div>
      <span className="home-loading__eyebrow">ADHI KESHAVAN B &nbsp;/&nbsp; PORTFOLIO</span>
      <h2>Preparing the<br /><em>workspace<span>.</span></em></h2>
      <p role="status">{progress === 100 ? 'Workspace ready.' : 'Bringing the studio into focus.'}</p>
      <div className="home-loading__progress-label"><span>LOADING WORKSPACE</span><strong aria-hidden="true">{progress}<small>%</small></strong></div>
      <div className="home-loading__track" role="progressbar" aria-label="Loading workspace" aria-valuemin={1} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
      <Link to="/quick-view">Open quick view <ArrowUpRight size={15} /></Link>
    </div>
    <span className="home-loading__footer">DESK.OS &nbsp; / &nbsp; INTERACTIVE WORKSPACE</span>
  </motion.div>
}
