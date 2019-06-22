import React, {useReducer} from 'react'
import Point from 'src/components/Point'
import Line from 'src/components/Line'
import Circle from 'src/components/Circle'

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
          a: left.y - right.y,
          b: right.x - left.x,
          c: left.x * right.y - right.x * left.y,
        })
        break
      }
      case 'c': {
        const center = newConstruction[el.center] as Point
        const edge = newConstruction[el.edge] as Point
        newConstruction.push({
          ...el,
          h: center.x,
          k: center.y,
          r: Math.sqrt((center.x - edge.x) ** 2 + (center.y - edge.y) ** 2),
        })
        break
      }
      case 'i': {
        let el1 = newConstruction[el.element1]
        let el2 = newConstruction[el.element2]
        if (el1.type === 'c' && el2.type === 'c') {
          const d = Math.sqrt((el1.h - el2.h) ** 2 + (el1.k - el2.k) ** 2)
          const a = (el1.r ** 2 - el2.r ** 2 + d ** 2) / (2 * d)
          const h = Math.sqrt(el1.r ** 2 - a ** 2)
          const cx = el1.h + (a * (el2.h - el1.h)) / d
          const cy = el1.k + (a * (el2.k - el1.k)) / d
          const x = cx + ((el.neg ? 1 : -1) * h * (el2.k - el1.k)) / d
          const y = cy + ((el.neg ? -1 : 1) * h * (el2.h - el1.h)) / d
          newConstruction.push({...el, x, y})
        } else if (el1.type === 'l' && el2.type === 'l') {
          const x = (el2.c * el1.b - el1.c * el2.b) / (el1.a * el2.b - el2.a * el1.b)
          const y = (el2.c * el1.a - el1.c * el2.a) / (el1.a * el2.b - el2.a * el1.b)
          newConstruction.push({...el, x, y})
        } else {
          if (el1.type === 'l' && el2.type === 'c') {
            const temp = el1
            el1 = el2
            el2 = temp
          }
          if (el1.type === 'c' && el2.type === 'l') {
            const {a, b, c} = el2
            const {h, k, r} = el1
            const d = Math.sqrt(r ** 2 - (a * h + b * k + c) ** 2 / (a ** 2 + b ** 2))
            const x =
              (b * (b * h - a * k) - a * c + (el.neg ? -1 : 1) * b * d ** 2) / (a ** 2 + b ** 2)
            const y =
              (a * (-b * h + a * k) - b * c + (el.neg ? 1 : -1) * a * d ** 2) / (a ** 2 + b ** 2)
            newConstruction.push({...el, x, y})
          } else {
            throw new Error('Not a valid intersection')
          }
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
