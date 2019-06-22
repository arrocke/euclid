import React, {createContext, useReducer, useEffect, useContext, useMemo} from 'react'
import * as compute from 'src/utils/compute'
import {ConstructionState, ElementState, Element, Point} from 'src/types'

interface ConstructionContextValue {
  construction: ConstructionState
  dispatch: React.Dispatch<ReducerAction>
}

interface ConstructionProviderProps {
  value?: ConstructionContextValue
  initial: Element[] | Promise<Element[]>
}

interface InitAction {
  type: 'init'
  data: Element[]
}

type ReducerAction = InitAction

const ConstructionContext = createContext<ConstructionContextValue | null>(null)

const reducer: React.Reducer<ConstructionState, ReducerAction> = (state, {type, data}) => {
  switch (type) {
    case 'init': {
      const elements = data.reduce<ElementState[]>((construction, el) => {
        switch (el.type) {
          case 'p': {
            construction.push(el)
            break
          }
          case 'l': {
            const left = construction[el.left] as Point
            const right = construction[el.right] as Point
            construction.push({
              ...el,
              ...compute.line(left, right),
            })
            break
          }
          case 'c': {
            const center = construction[el.center] as Point
            const edge = construction[el.edge] as Point
            construction.push({
              ...el,
              ...compute.circle(center, edge),
            })
            break
          }
          case 'i': {
            let el1 = construction[el.element1]
            let el2 = construction[el.element2]
            if (el1.type === 'c' && el2.type === 'c') {
              construction.push({
                ...el,
                ...compute.circleIntersection(el1, el2, el.neg),
              })
            } else if (el1.type === 'l' && el2.type === 'l') {
              construction.push({...el, ...compute.lineIntersection(el1, el2)})
            } else if (el1.type === 'l' && el2.type === 'c') {
              construction.push({
                ...el,
                ...compute.circleLineIntersection(el2, el1, el.neg),
              })
            } else if (el1.type === 'c' && el2.type === 'l') {
              construction.push({
                ...el,
                ...compute.circleLineIntersection(el1, el2, el.neg),
              })
            } else {
              throw new Error('Not a valid intersection')
            }
            break
          }
        }
        return construction
      }, [])
      return {elements}
    }
  }
  return state
}

export const ConstructionProvider: React.FC<ConstructionProviderProps> = ({
  value,
  initial,
  children,
}) => {
  const [construction, dispatch] = useReducer(reducer, {elements: []})

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
    construction: {elements},
  } = context
  return {elements}
}
