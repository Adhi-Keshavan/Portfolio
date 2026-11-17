import { useCallback, useState } from 'react'

export type WorkspaceObject = 'monitor' | 'keyboard' | 'notebook' | 'phone'

export function useWorkspaceSelection() {
  const [selected, setSelected] = useState<WorkspaceObject | null>(null)
  const select = useCallback((object: WorkspaceObject) => setSelected(object), [])
  const clear = useCallback(() => setSelected(null), [])
  return { selected, select, clear }
}
