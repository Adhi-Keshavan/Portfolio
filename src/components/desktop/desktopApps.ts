import { Contact, FileText, FolderOpen, Settings2, TerminalSquare, UserRound, Wrench, type LucideIcon } from 'lucide-react'
import type { DesktopApp } from '../../store/workspaceStore'

export const appLabels: Record<DesktopApp, string> = { projects: 'Project Explorer', terminal: 'Terminal', about: 'About', skills: 'Skills', resume: 'Résumé Viewer', contact: 'Contact', settings: 'Settings' }
export const appIcons: Record<DesktopApp, LucideIcon> = { projects: FolderOpen, terminal: TerminalSquare, about: UserRound, skills: Wrench, resume: FileText, contact: Contact, settings: Settings2 }
