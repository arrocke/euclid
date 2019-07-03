import React, {createContext, useReducer, useEffect, useContext, useMemo} from 'react'
import * as Compute from 'src/utils/compute'
import {ConstructionState, ElementState, Element, ConstructionPoint} from 'src/types'

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

const computeIntersection = (
  el1: ElementState,
  el2: ElementState,
  neg: boolean = false,
): Compute.Point | null => {
  if ((el1.type === 'l' || el1.type === 'c') && (el2.type === 'l' || el2.type === 'c')) {
    return Compute.intersection(el1, el2, neg)
  } else {
    return null
  }
}

const EPSILON = 0.00001
// Add points to the list by finding intersection with previous elements.
const appendIntersections = (
  {elements, points}: ConstructionState,
  element: ElementState,
): ConstructionPoint[] => {
  return elements.reduce((newPoints, el) => {
    const point1 = computeIntersection(element, el, true)
    if (
      point1 &&
      newPoints.every(
        ({x, y}) => Math.abs(x - point1.x) > EPSILON || Math.abs(y - point1.y) > EPSILON,
      )
    ) {
      newPoints.push(point1)
    }
    const point2 = computeIntersection(element, el, false)
    if (
      point2 &&
      newPoints.every(
        ({x, y}) => Math.abs(x - point2.x) > EPSILON || Math.abs(y - point2.y) > EPSILON,
      )
    ) {
      newPoints.push(point2)
    }
    return newPoints
  }, points)
}

const reducer: React.Reducer<ConstructionState, ReducerAction> = (state, action) => {
  switch (action.type) {
    case 'init': {
      return action.data.reduce<ConstructionState>(
        ({elements, points}, el) => {
          switch (el.type) {
            case 'p': {
              points.push({...el, id: elements.length})
              elements.push(el)
              break
            }
            case 'l': {
              const left = elements[el.left]
              const right = elements[el.right]
              if (['i', 'p'].includes(left.type) && ['i', 'p'].includes(right.type)) {
                const line = {
                  ...el,
                  ...Compute.line(left as Compute.Point, right as Compute.Point),
                }
                appendIntersections({elements, points}, line)
                elements.push(line)
              } else {
                throw new Error('Invalid line')
              }
              break
            }
            case 'c': {
              const center = elements[el.center]
              const edge = elements[el.edge]
              if (['i', 'p'].includes(center.type) && ['i', 'p'].includes(edge.type)) {
                const circle = {
                  ...el,
                  ...Compute.circle(center as Compute.Point, edge as Compute.Point),
                }
                appendIntersections({elements, points}, circle)
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
    case 'point': {
      return {
        elements: [...state.elements, {type: 'p', x: action.data.x, y: action.data.y}],
        points: [...state.points, {id: state.elements.length, x: action.data.x, y: action.data.y}],
      }
    }
    case 'line': {
      const el: ElementState = {
        ...Compute.line(state.points[action.data.left], state.points[action.data.right]),
        type: 'l',
        left: action.data.left,
        right: action.data.right,
      }
      return {
        elements: [...state.elements, el],
        points: appendIntersections({elements: state.elements, points: [...state.points]}, el),
      }
    }
    case 'circle': {
      const el: ElementState = {
        ...Compute.circle(state.points[action.data.center], state.points[action.data.edge]),
        type: 'c',
        edge: action.data.edge,
        center: action.data.center,
      }
      return {
        elements: [...state.elements, el],
        points: appendIntersections({elements: state.elements, points: [...state.points]}, el),
      }
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
