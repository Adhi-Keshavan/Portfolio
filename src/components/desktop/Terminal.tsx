import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { person, projects, skillGroups } from '../../data/portfolio'
import { useWorkspaceStore } from '../../store/workspaceStore'

type Line = { prompt?: string; text: string }
const help = ['help', 'about', 'skills', 'projects', 'projects list', 'projects open [project-id]', 'education', 'contact', 'resume', 'theme day', 'theme night', 'workspace', 'exit', 'clear']

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([{ text: 'The Living Workspace terminal. Type help to see supported commands.' }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { openApp, openProject, setTheme, setMode } = useWorkspaceStore()
  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }) }, [lines])

  const execute = (raw: string) => {
    const command = raw.trim().toLowerCase().replace(/\s+/g, ' ')
    if (!command) return
    setHistory(items => [...items, raw])
    setHistoryIndex(history.length + 1)
    if (command === 'clear') { setLines([]); return }
    const output: string[] = []
    if (command === 'help') output.push('Supported commands:', ...help.map(item => `  ${item}`))
    else if (command === 'about') { output.push(`${person.name} — ${person.role}.`, `Based in ${person.location}.`); openApp('about') }
    else if (command === 'education') { output.push(`${person.education}`, `${person.college} · ${person.years}`); openApp('about') }
    else if (command === 'skills') { output.push(...skillGroups.map(group => `${group.name}: ${group.items.join(', ')}`)); openApp('skills') }
    else if (command === 'projects' || command === 'projects list') output.push(...projects.map(project => `${project.slug} — ${project.title}: ${project.summary}`))
    else if (command.startsWith('projects open ')) {
      const slug = command.slice('projects open '.length)
      const project = projects.find(item => item.slug === slug)
      if (project) { openProject(slug); output.push(`Opened ${project.title} in Project Explorer.`) }
      else output.push(`Project not found. Try: ${projects.map(item => item.slug).join(', ')}`)
    }
    else if (command === 'contact') { output.push(`Email: ${person.email}`, `GitHub: ${person.github}`, `LinkedIn: ${person.linkedin}`); openApp('contact') }
    else if (command === 'resume') {
      if (person.resume) { const link = document.createElement('a'); link.href = person.resume; link.download = 'Adhi-Keshavan-Resume.pdf'; link.click(); output.push('Downloading résumé.') }
      else output.push('Résumé is not available yet. Use contact for an email address.')
    }
    else if (command === 'theme day' || command === 'theme night') { const theme = command.split(' ')[1] as 'day' | 'night'; setTheme(theme); output.push(`Workspace theme set to ${theme}.`) }
    else if (command === 'workspace' || command === 'exit') { setMode('workspace'); output.push('Returned to the workspace.') }
    else output.push(`Unknown command: ${raw.trim()}`, 'Type help for available commands.')
    setLines(items => [...items, { prompt: raw, text: '' }, ...output.map(text => ({ text }))])
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { execute(input); setInput('') }
    if (event.key === 'ArrowUp') { event.preventDefault(); const next = Math.max(0, historyIndex - 1); setHistoryIndex(next); setInput(history[next] ?? '') }
    if (event.key === 'ArrowDown') { event.preventDefault(); const next = Math.min(history.length, historyIndex + 1); setHistoryIndex(next); setInput(history[next] ?? '') }
  }
  return <div className="terminal" onClick={() => inputRef.current?.focus()}><div className="terminal-output" role="log" aria-live="polite">{lines.map((line, index) => line.prompt ? <p className="terminal-prompt" key={index}>adhi@workspace:~$ {line.prompt}</p> : <p key={index}>{line.text || '\u00a0'}</p>)}<div ref={bottomRef} /></div><label className="terminal-entry"><span>adhi@workspace:~$</span><input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={onKeyDown} spellCheck={false} autoComplete="off" autoCapitalize="off" aria-label="Terminal command" /></label></div>
}
