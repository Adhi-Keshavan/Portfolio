import { useCallback, useEffect, useState } from 'react'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import { projects } from './data/portfolio'
import './App.css'

function App() {
  const [, setLocationKey] = useState(window.location.pathname + window.location.search)
  const navigate = useCallback((url: string, scroll = true) => {
    window.history.pushState({}, '', url)
    window.dispatchEvent(new Event('portfolio:navigate'))
    if (scroll) {
      const hash = new URL(url, window.location.origin).hash
      requestAnimationFrame(() => { if (hash) document.querySelector(hash)?.scrollIntoView(); else window.scrollTo(0, 0) })
    }
  }, [])
  useEffect(() => {
    const sync = () => setLocationKey(window.location.pathname + window.location.search)
    window.addEventListener('popstate', sync)
    window.addEventListener('portfolio:navigate', sync)
    const onLink = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a')
      if (!anchor || anchor.origin !== window.location.origin || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.hasAttribute('download')) return
      if (!anchor.pathname.startsWith('/projects/') && anchor.pathname !== '/') return
      event.preventDefault()
      navigate(anchor.pathname + anchor.search + anchor.hash)
    }
    document.addEventListener('click', onLink)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('portfolio:navigate', sync); document.removeEventListener('click', onLink) }
  }, [navigate])
  const slug = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1]
  const project = projects.find(item => item.slug === slug)
  if (slug) return project ? <ProjectDetail project={project} /> : <div className="not-found"><h1>Project not found.</h1><a href="/#projects">Return to projects →</a></div>
  return <Home />
}

export default App
