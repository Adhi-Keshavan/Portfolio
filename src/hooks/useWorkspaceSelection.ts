import { useWorkspaceStore, type WorkspaceObject } from '../store/workspaceStore'
export type { WorkspaceObject } from '../store/workspaceStore'

export function useWorkspaceSelection() {
  const selected = useWorkspaceStore(state => state.selected)
  const select = useWorkspaceStore(state => state.selectObject) as (object: WorkspaceObject) => void
  const clear = useWorkspaceStore(state => state.clearObject)
  return { selected, select, clear }
}
