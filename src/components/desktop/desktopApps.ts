import { Contact, FolderOpen, TerminalSquare, UserRound, Wrench, type LucideIcon } from 'lucide-react'
import type { DesktopApp } from '../../store/workspaceStore'

export const appLabels: Record<DesktopApp, string> = { projects: 'Project Explorer', terminal: 'Terminal', about: 'About', skills: 'Skills', contact: 'Contact' }
export const appIcons: Record<DesktopApp, LucideIcon> = { projects: FolderOpen, terminal: TerminalSquare, about: UserRound, skills: Wrench, contact: Contact }
