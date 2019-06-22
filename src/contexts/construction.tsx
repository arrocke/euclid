import React, {createContext, useReducer, useEffect, useContext, useMemo} from 'react'
import * as compute from 'src/utils/compute'
import {ConstructionState, ElementState, Element} from 'src/types'

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

const computeIntersection = (
  el1: ElementState,
  el2: ElementState,
  neg: boolean = false,
): compute.Point | null => {
  if (el1.type === 'c' && el2.type === 'c') {
    return compute.circleIntersection(el1, el2, neg)
  } else if (el1.type === 'l' && el2.type === 'l') {
    return compute.lineIntersection(el1, el2)
  } else if (el1.type === 'l' && el2.type === 'c') {
    return compute.circleLineIntersection(el2, el1, neg)
  } else if (el1.type === 'c' && el2.type === 'l') {
    return compute.circleLineIntersection(el1, el2, neg)
  } else {
    return null
  }
}

const reducer: React.Reducer<ConstructionState, ReducerAction> = (state, {type, data}) => {
  const EPSILON = 0.00001
  switch (type) {
    case 'init': {
      return data.reduce<ConstructionState>(
        ({elements, points}, el) => {
          // Add points to the list by finding intersection with previous elements.
          const addPoints = (element: ElementState) => {
            elements.forEach((el) => {
              const point1 = computeIntersection(element, el, true)
              if (
                point1 &&
                points.every(
                  ({x, y}) => Math.abs(x - point1.x) > EPSILON || Math.abs(y - point1.y) > EPSILON,
                )
              ) {
                points.push(point1)
              }
              const point2 = computeIntersection(element, el, false)
              if (
                point2 &&
                points.every(
                  ({x, y}) => Math.abs(x - point2.x) > EPSILON || Math.abs(y - point2.y) > EPSILON,
                )
              ) {
                points.push(point2)
              }
            })
          }

          switch (el.type) {
            case 'p': {
              points.push({...el, id: elements.length})
              elements.push(el)
              break
            }
            case 'l': {
              const left = elements[el.left]
              const right = elements[el.right]
              if (left.type === 'p' && right.type === 'p') {
                const line = {
                  ...el,
                  ...compute.line(left, right),
                }
                addPoints(line)
                elements.push(line)
              } else {
                throw new Error('Invalid line')
              }
              break
            }
            case 'c': {
              const center = elements[el.center]
              const edge = elements[el.edge]
              if (center.type === 'p' && edge.type === 'p') {
                const circle = {
                  ...el,
                  ...compute.circle(center, edge),
                }
                addPoints(circle)
                elements.push(circle)
              } else {
                throw new Error('Invalid circle')
              }
              break
            }
            case 'i': {
              const el1 = elements[el.element1]
              const el2 = elements[el.element2]
              const intersection = computeIntersection(el1, el2, el.neg)
              if (intersection) {
                const i = points.findIndex(
                  (point) =>
                    Math.abs(intersection.x - point.x) < EPSILON &&
                    Math.abs(intersection.y - point.y) < EPSILON,
                )
                points[i].id = elements.length
                elements.push({
                  ...el,
                  ...intersection,
                })
              } else {
                throw new Error('Invalid intersection')
              }
              break
            }
          }
          return {elements, points}
        },
        {elements: [], points: []},
      )
    }
  }
  return state
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
  } = context
  return {elements, points}
}