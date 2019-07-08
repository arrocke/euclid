import * as Compute from 'src/utils/compute'

export interface PointInit extends Compute.Point {
  type: 'point'
}

export interface LineInit {
  type: 'line'
  left: number
  right: number
}

export interface CircleInit {
  type: 'circle'
  center: number
  edge: number
}

export interface IntersectionInit {
  type: 'intersection'
  one: number
  two: number
  neg: boolean
}

export interface Point extends PointInit, Compute.Point {
  id: number
}

export interface Line extends Compute.Line, LineInit {
  id: number
}

export interface Circle extends Compute.Circle, CircleInit {
  id: number
}

export interface Intersection extends Compute.Point, IntersectionInit {
  id: number
}

export interface ConstructionIntersection extends Compute.Point, IntersectionInit {}

export type ElementInit = PointInit | LineInit | CircleInit | IntersectionInit
export type Element = Point | Line | Circle | Intersection
export type ConstructionPoint = Point | Intersection

export interface Construction {
  elements: Element[]
  points: ConstructionPoint[]
}

function addIntersections(
  elements: Element[],
  points: ConstructionPoint[],
  newElement: Circle | Line,
) {
  elements.forEach((element) => {
    if (element.type === 'line' || element.type === 'circle') {
      const point1 = Compute.intersection(element, newElement, true)
      const point2 = Compute.intersection(element, newElement, false)
      // Ensure the intersection is unique.
      if (
        points.every(
          ({x, y}) => !Compute.floatEqual(x, point1.x) || !Compute.floatEqual(y, point1.y),
        )
      ) {
        points.push({
          ...point1,
          type: 'intersection',
          one: newElement.id,
          two: element.id,
          id: -1,
          neg: true,
        })
      }
      if (
        points.every(
          ({x, y}) => !Compute.floatEqual(x, point2.x) || !Compute.floatEqual(y, point2.y),
        )
      ) {
        points.push({
          ...point2,
          type: 'intersection',
          one: newElement.id,
          two: element.id,
          id: -1,
          neg: false,
        })
      }
    }
  })
}

export function create(elementInits: ElementInit[] = []): Construction {
  const elements: Element[] = []
  const points: ConstructionPoint[] = []
  elementInits.forEach((element) => {
    switch (element.type) {
      case 'point': {
        const point = {
          ...element,
          id: elements.length,
        }
        elements.push(point)
        points.push(point)
        break
      }
      case 'line': {
        const line = {
          ...element,
          ...Compute.line(elements[element.left] as Point, elements[element.right] as Point),
          id: elements.length,
        }
        addIntersections(elements, points, line)
        elements.push(line)
        break
      }
      case 'circle': {
        const circle = {
          ...element,
          ...Compute.circle(elements[element.center] as Point, elements[element.edge] as Point),
          id: elements.length,
        }
        addIntersections(elements, points, circle)
        elements.push(circle)
        break
      }
      case 'intersection': {
        const one = elements[element.one]
        const two = elements[element.two]
        if (
          (one.type === 'line' || one.type === 'circle') &&
          (two.type === 'line' || two.type === 'circle')
        ) {
          const intersection = {
            ...element,
            ...Compute.intersection(one, two),
            id: elements.length,
          }
          const point = points.filter(
            ({x, y}) =>
              Compute.floatEqual(x, intersection.x) && Compute.floatEqual(y, intersection.y),
          )[0]
          const index = points.indexOf(point)
          points.splice(index, 1, intersection)
          elements.push(intersection)
          break
        }
      }
    }
  })
  return {elements, points}
}
