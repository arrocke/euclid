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

export type ElementInit = PointInit | LineInit | CircleInit | IntersectionInit
export type Element = Point | Line | Circle | Intersection
export type ConstructionPoint = Point | Intersection

export interface Construction {
  elements: Element[]
  points: ConstructionPoint[]
}

export class ConstructionError extends Error {
  public constructor(message?: string) {
    super(message ? `Construction Error: ${message}` : 'Construction Error')
  }
}

function findIntersections(
  elements: Element[],
  points: ConstructionPoint[],
  newElement: Circle | Line,
): ConstructionPoint[] {
  const newPoints = points.slice()
  elements.forEach((element) => {
    if (element.type === 'line' || element.type === 'circle') {
      const point1 = Compute.intersection(element, newElement, true)
      const point2 = Compute.intersection(element, newElement, false)
      // Ensure the intersection is unique.
      if (newPoints.every((p) => !Compute.pointEqual(p, point1))) {
        newPoints.push({
          ...point1,
          type: 'intersection',
          one: newElement.id,
          two: element.id,
          id: -1,
          neg: true,
        })
      }
      if (newPoints.every((p) => !Compute.pointEqual(p, point2))) {
        newPoints.push({
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
  return newPoints
}

export function addPoint({elements, points}: Construction, {x, y}: Compute.Point): Construction {
  const point: Point = {
    x,
    y,
    id: elements.length,
    type: 'point',
  }
  if (points.every((p) => !Compute.pointEqual(p, point))) {
    return {
      elements: [...elements, point],
      points: [...points, point],
    }
  } else {
    throw new ConstructionError('Point or intersection already exists.')
  }
}

function addIntersection(
  construction: Construction,
  oneIndex: number,
  twoIndex: number,
  neg: boolean,
): Construction {
  const one = construction.elements[oneIndex]
  const two = construction.elements[twoIndex]
  if (
    one &&
    two &&
    (one.type === 'line' || one.type === 'circle') &&
    (two.type === 'line' || two.type === 'circle')
  ) {
    const intersection: Intersection = {
      ...Compute.intersection(one, two),
      neg,
      type: 'intersection',
      one: oneIndex,
      two: twoIndex,
      id: construction.elements.length,
    }
    const points = construction.points.slice()
    const index = points.indexOf(points.filter((p) => Compute.pointEqual(p, intersection))[0])
    points.splice(index, 1, intersection)
    return {
      points,
      elements: [...construction.elements, intersection],
    }
  } else {
    return construction
  }
}

export function addLine(
  construction: Construction,
  leftIndex: number,
  rightIndex: number,
): Construction {
  let {elements, points} = construction

  // Find the points for the line.
  const left = points[leftIndex]
  const right = points[rightIndex]
  if (!left || !right) {
    throw new ConstructionError('Points to contstruct the line do not exist.')
  }

  // Construct the line.
  const line: Line = {
    ...Compute.line(left, right),
    id: -1,
    type: 'line',
    left: leftIndex,
    right: rightIndex,
  }

  // Throw error if line already exists.
  if (elements.some((element) => element.type === 'line' && Compute.lineEqual(element, line))) {
    throw new ConstructionError('Line already exists.')
  }

  // Add intersections to construction if not already in.
  if (left.id === -1) {
    const intersection = {
      ...left,
      id: elements.length,
    }
    points = points.slice()
    points.splice(points.indexOf(left), 1, intersection)
    elements = [...elements, intersection]
  }
  if (right.id === -1) {
    const intersection = {
      ...right,
      id: elements.length,
    }
    points = points.slice()
    points.splice(points.indexOf(right), 1, intersection)
    elements = [...elements, intersection]
  }

  // Add instersections created by the new line.
  line.id = elements.length
  points = findIntersections(elements, points, line)

  return {elements: [...elements, line], points}
}

export function addCircle(
  construction: Construction,
  centerIndex: number,
  edgeIndex: number,
): Construction {
  let {elements, points} = construction

  // Find the points for the line.
  const center = points[centerIndex]
  const edge = points[edgeIndex]
  if (!center || !edge) {
    throw new ConstructionError('Points to contstruct the circle do not exist.')
  }

  // Construct the circle.
  const circle: Circle = {
    ...Compute.circle(center, edge),
    id: -1,
    type: 'circle',
    center: centerIndex,
    edge: edgeIndex,
  }

  // Throw error if circle already exists.
  if (
    elements.some((element) => element.type === 'circle' && Compute.circleEqual(element, circle))
  ) {
    throw new ConstructionError('Circle already exists.')
  }

  // Add intersections to construction if not already in.
  if (center.id === -1) {
    const intersection = {
      ...center,
      id: elements.length,
    }
    points = points.slice()
    points.splice(points.indexOf(center), 1, intersection)
    elements = [...elements, intersection]
  }
  if (edge.id === -1) {
    const intersection = {
      ...edge,
      id: elements.length,
    }
    points = points.slice()
    points.splice(points.indexOf(edge), 1, intersection)
    elements = [...elements, intersection]
  }

  // Add instersections created by the new circle.
  circle.id = elements.length
  points = findIntersections(elements, points, circle)

  return {elements: [...elements, circle], points}
}

export function create(initialElements: ElementInit[] = []): Construction {
  return initialElements.reduce(
    (construction: Construction, element: ElementInit): Construction => {
      switch (element.type) {
        case 'point':
          return addPoint(construction, element)
        case 'line':
          return addLine(construction, element.left, element.right)
        case 'circle':
          return addCircle(construction, element.center, element.edge)
        case 'intersection':
          return addIntersection(construction, element.one, element.two, element.neg)
      }
    },
    {
      elements: [],
      points: [],
    },
  )
}
