import React, {createContext, useState, useContext, useMemo} from 'react'

interface CanvasDimensions {
  left: number
  top: number
  width: number
  height: number
}

interface CanvasContextValue {
  state: CanvasDimensions
  setState: (state: CanvasDimensions) => void
}

interface CanvasProvderProps {
  value?: CanvasContextValue
}

const CanvasContext = createContext<CanvasContextValue | null>(null)

export const CanvasProvider: React.FC<CanvasProvderProps> = ({value, children}) => {
  const [state, setState] = useState<CanvasDimensions>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  const contextValue = useMemo<CanvasContextValue>(() => ({state, setState} || value), [
    state,
    setState,
    value,
  ])

  return <CanvasContext.Provider value={contextValue}>{children}</CanvasContext.Provider>
}

export const useCanvasResize = () => {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvasResize must be used within a CanvasProvider.')
  }
  return context.setState
}

export const useCanvasDimensions = () => {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvasResize must be used within a CanvasProvider.')
  }
  const {state} = context
  return state
}
