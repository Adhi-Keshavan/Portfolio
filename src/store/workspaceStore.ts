import { create } from 'zustand'

export type DesktopApp = 'projects' | 'terminal' | 'about' | 'skills' | 'contact'
export type WorkspaceObject = 'monitor' | 'keyboard' | 'notebook' | 'phone'
export type Theme = 'day' | 'night'
export type DesktopWindowState = {
  app: DesktopApp
  x: number
  y: number
  width: number
  height: number
  z: number
  minimized: boolean
  maximized: boolean
}

type WorkspaceStore = {
  mode: 'workspace' | 'desktop'
  selected: WorkspaceObject | null
  theme: Theme
  lampOn: boolean
  windows: DesktopWindowState[]
  topZ: number
  projectSlug: string | null
  setMode: (mode: 'workspace' | 'desktop') => void
  selectObject: (object: WorkspaceObject) => void
  clearObject: () => void
  setTheme: (theme: Theme) => void
  toggleLamp: () => void
  openApp: (app: DesktopApp) => void
  openProject: (slug: string) => void
  closeApp: (app: DesktopApp) => void
  minimizeApp: (app: DesktopApp) => void
  focusApp: (app: DesktopApp) => void
  moveApp: (app: DesktopApp, x: number, y: number) => void
  resizeApp: (app: DesktopApp, width: number, height: number) => void
  toggleMaximize: (app: DesktopApp) => void
  keepWindowsInView: () => void
}

const initialTheme = (): Theme => {
  try { return localStorage.getItem('workspace-theme') === 'day' ? 'day' : 'night' } catch { return 'night' }
}

const defaultSize: Record<DesktopApp, [number, number]> = {
  projects: [940, 650], terminal: [740, 490], about: [670, 540], skills: [700, 530], contact: [610, 510],
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  mode: 'workspace',
  selected: null,
  theme: initialTheme(),
  lampOn: true,
  windows: [],
  topZ: 1,
  projectSlug: null,
  setMode: mode => set({ mode, ...(mode === 'workspace' ? { selected: null } : {}) }),
  selectObject: selected => set({ selected }),
  clearObject: () => set({ selected: null }),
  setTheme: theme => { try { localStorage.setItem('workspace-theme', theme) } catch { /* storage may be disabled */ } set({ theme }) },
  toggleLamp: () => set(state => ({ lampOn: !state.lampOn })),
  openApp: app => {
    const state = get()
    const z = state.topZ + 1
    const existing = state.windows.find(item => item.app === app)
    if (existing) {
      set({ mode: 'desktop', topZ: z, windows: state.windows.map(item => item.app === app ? { ...item, minimized: false, z } : item) })
      return
    }
    const [defaultWidth, defaultHeight] = defaultSize[app]
    const width = Math.min(defaultWidth, Math.max(420, window.innerWidth - 48))
    const height = Math.min(defaultHeight, Math.max(300, window.innerHeight - 136))
    const offset = state.windows.length * 28
    const x = Math.max(12, Math.min((window.innerWidth - width) / 2 + offset, window.innerWidth - width - 12))
    const y = Math.max(55, Math.min((window.innerHeight - height) / 2 + offset, window.innerHeight - height - 65))
    set({ mode: 'desktop', topZ: z, windows: [...state.windows, { app, x, y, width, height, z, minimized: false, maximized: false }] })
  },
  openProject: slug => { set({ projectSlug: slug }); get().openApp('projects') },
  closeApp: app => set(state => ({ windows: state.windows.filter(item => item.app !== app) })),
  minimizeApp: app => set(state => ({ windows: state.windows.map(item => item.app === app ? { ...item, minimized: true } : item) })),
  focusApp: app => set(state => ({ topZ: state.topZ + 1, windows: state.windows.map(item => item.app === app ? { ...item, z: state.topZ + 1, minimized: false } : item) })),
  moveApp: (app, x, y) => set(state => ({ windows: state.windows.map(item => item.app === app ? { ...item, x: Math.max(0, Math.min(x, window.innerWidth - item.width)), y: Math.max(48, Math.min(y, window.innerHeight - item.height - 54)) } : item) })),
  resizeApp: (app, width, height) => set(state => ({ windows: state.windows.map(item => item.app === app ? { ...item, width: Math.max(420, Math.min(width, window.innerWidth - item.x - 10)), height: Math.max(300, Math.min(height, window.innerHeight - item.y - 54)) } : item) })),
  toggleMaximize: app => set(state => ({ windows: state.windows.map(item => item.app === app ? { ...item, maximized: !item.maximized } : item) })),
  keepWindowsInView: () => set(state => ({ windows: state.windows.map(item => {
    const width = Math.min(item.width, Math.max(420, window.innerWidth - 24))
    const height = Math.min(item.height, Math.max(300, window.innerHeight - 118))
    return { ...item, width, height, x: Math.max(0, Math.min(item.x, window.innerWidth - width)), y: Math.max(48, Math.min(item.y, window.innerHeight - height - 54)) }
  }) })),
}))
