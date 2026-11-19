import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Home from './pages/Home'
import QuickView from './pages/QuickView'
import ProjectDetail from './pages/ProjectDetail'
import { projects } from './data/portfolio'
import './App.css'
import './styles/living.css'

function RouteScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      else window.scrollTo(0, 0)
    }, 30)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])
  return null
}

function ProjectRoute() {
  const { slug } = useParams()
  const project = projects.find(item => item.slug === slug)
  return project ? <ProjectDetail project={project} /> : <div className="not-found"><h1>Project not found.</h1><a href="/quick-view#projects">Return to projects</a></div>
}

function App() {
  return <BrowserRouter><RouteScroll /><Routes><Route path="/" element={<Home />} /><Route path="/quick-view" element={<QuickView />} /><Route path="/projects/:slug" element={<ProjectRoute />} /><Route path="*" element={<div className="not-found"><h1>Page not found.</h1><a href="/">Return to workspace</a></div>} /></Routes></BrowserRouter>
}

export default App
