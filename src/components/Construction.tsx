import React, {useReducer} from 'react'
import Point from 'src/components/Point'
import Line from 'src/components/Line'
import Circle from 'src/components/Circle'
import * as compute from 'src/utils/compute'

interface Point {
  type: 'p'
  x: number
  y: number
}

interface Line {
  type: 'l'
  left: number
  right: number
}

interface LineState extends Line {
  a: number
  b: number
  c: number
}

interface Circle {
  type: 'c'
  center: number
  edge: number
}

interface CircleState extends Circle {
  h: number
  k: number
  r: number
}

interface Intersection {
  type: 'i'
  element1: number
  element2: number
  neg?: boolean
}

interface IntersectionState extends Intersection {
  x: number
  y: number
}

type Element = Point | Line | Circle | Intersection
type ElementState = Point | LineState | CircleState | IntersectionState

type ConstructionData = Element[]
type ConstructionState = ElementState[]

const reducer = (state: ConstructionState): ConstructionState => {
  return state
}

const init = (construction: ConstructionData): ConstructionState =>
  construction.reduce<ConstructionState>((newConstruction, el) => {
    switch (el.type) {
      case 'p': {
        newConstruction.push(el)
        break
      }
      case 'l': {
        const left = newConstruction[el.left] as Point
        const right = newConstruction[el.right] as Point
        newConstruction.push({
          ...el,
          ...compute.line(left, right),
        })
        break
      }
      case 'c': {
        const center = newConstruction[el.center] as Point
        const edge = newConstruction[el.edge] as Point
        newConstruction.push({
          ...el,
          ...compute.circle(center, edge),
        })
        break
      }
      case 'i': {
        let el1 = newConstruction[el.element1]
        let el2 = newConstruction[el.element2]
        if (el1.type === 'c' && el2.type === 'c') {
          newConstruction.push({
            ...el,
            ...compute.circleIntersection(el1, el2, el.neg),
          })
        } else if (el1.type === 'l' && el2.type === 'l') {
          newConstruction.push({...el, ...compute.lineIntersection(el1, el2)})
        } else if (el1.type === 'l' && el2.type === 'c') {
          newConstruction.push({
            ...el,
            ...compute.circleLineIntersection(el2, el1, el.neg),
          })
        } else if (el1.type === 'c' && el2.type === 'l') {
          newConstruction.push({
            ...el,
            ...compute.circleLineIntersection(el1, el2, el.neg),
          })
        } else {
          throw new Error('Not a valid intersection')
        }
        break
      }
    }
    return newConstruction
  }, [])

const initValue: ConstructionData = [
  {type: 'p', x: 0, y: -100},
  {type: 'p', x: 0, y: 100},
  {type: 'l', left: 0, right: 1},
  {type: 'c', center: 0, edge: 1},
  {type: 'c', center: 1, edge: 0},
  {type: 'i', element1: 3, element2: 4, neg: true},
  {type: 'i', element1: 3, element2: 4, neg: false},
  {type: 'i', element1: 2, element2: 4, neg: false},
  {type: 'i', element1: 2, element2: 3, neg: true},
  {type: 'l', left: 5, right: 6},
  {type: 'i', element1: 9, element2: 2},
]

const Construction: React.FC = () => {
  const [construction, dispatch] = useReducer(reducer, initValue, init)

  const elements = construction.map((el: ElementState, i) => {
    switch (el.type) {
      case 'p':
        return <Point key={i} x={el.x} y={el.y} />
      case 'l':
        return <Line key={i} a={el.a} b={el.b} c={el.c} />
      case 'c':
        return <Circle key={i} h={el.h} k={el.k} r={el.r} />
      case 'i':
        return <Point key={i} x={el.x} y={el.y} />
    }
  })

  return <>{elements}</>
}

export default Construction
