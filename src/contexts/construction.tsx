import React, {createContext, useReducer, useEffect, useContext, useMemo} from 'react'
import * as Construction from 'src/utils/construction'

interface ConstructionContextValue {
  construction: Construction.Construction
  dispatch: React.Dispatch<ReducerAction>
}

interface ConstructionProviderProps {
  value?: ConstructionContextValue
  initial: Construction.ElementInit[] | Promise<Construction.ElementInit[]>
}

interface InitAction {
  type: 'init'
  data: Construction.ElementInit[]
}

interface PointAction {
  type: 'point'
  data: {x: number; y: number}
}

interface LineAction {
  type: 'line'
  data: {left: number; right: number}
}

interface CircleAction {
  type: 'circle'
  data: {center: number; edge: number}
}

type ReducerAction = InitAction | PointAction | LineAction | CircleAction

const ConstructionContext = createContext<ConstructionContextValue | null>(null)

const reducer: React.Reducer<Construction.Construction, ReducerAction> = (state, action) => {
  switch (action.type) {
    case 'init':
      return Construction.create(action.data)
    case 'point':
      return Construction.addPoint(state, action.data)
    case 'line':
      return Construction.addLine(state, action.data.left, action.data.right)
    case 'circle': {
      return Construction.addCircle(state, action.data.center, action.data.edge)
    }
  }
}

export const ConstructionProvider: React.FC<ConstructionProviderProps> = ({
  value,
  initial,
  children,
}) => {
  const [construction, dispatch] = useReducer(reducer, {elements: [], points: []})

  // Reloads the construction when the initial prop changes.
  useEffect(() => {
    const effect = async () =>
      dispatch({type: 'init', data: initial instanceof Promise ? await initial : initial})
    effect()
  }, [initial])

  const contextValue = useMemo(() => value || {construction, dispatch}, [construction])

  return (
    <ConstructionContext.Provider value={contextValue}>{children}</ConstructionContext.Provider>
  )
}

export const useConstruction = () => {
  const context = useContext(ConstructionContext)
  if (!context) {
    throw new Error('useConstruction must be used within a ConstructionProvider.')
  }
  const {
    construction: {elements, points},
    dispatch,
  } = context
  const addPoint = (x: number, y: number): void => {
    dispatch({
      type: 'point',
      data: {x, y},
    })
  }
  const addLine = (left: number, right: number): void => {
    dispatch({
      type: 'line',
      data: {left, right},
    })
  }
  const addCircle = (center: number, edge: number): void => {
    dispatch({
      type: 'circle',
      data: {center, edge},
    })
  }
  return {elements, points, addPoint, addLine, addCircle}
}
