import * as Geometry from 'src/geometry'
import {produce} from 'immer'

export interface PointInit extends Geometry.Point {
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

export interface Point extends PointInit, Geometry.Point {
  id: number
}

export interface Line extends Geometry.Line, LineInit {
  id: number
}

export interface Circle extends Geometry.Circle, CircleInit {
  id: number
}

export interface Intersection extends Geometry.Point, IntersectionInit {
  id: number
}

/**
 * Data used to initialize an element in a construction.
 */
export type ElementInit = PointInit | LineInit | CircleInit | IntersectionInit

/**
 * Data used to maintain an element while used within the app.
 */
export type Element = Point | Line | Circle | Intersection

/**
 * Data for a point or intersection in a construction.
 */
export type ConstructionPoint = Point | Intersection

/**
 * Data used to maintain a construction within the app.
 */
export interface Construction {
  elements: Element[]
  points: ConstructionPoint[]
}

/**
 * Describes an error that occurs when manipulating constructions.
 */
export class ConstructionError extends Error {
  public constructor(message?: string) {
    super(message ? `Construction Error: ${message}` : 'Construction Error')
  }
}

/**
 * Returns the list of points updated with intersections with the new element.
 * @param elements the elements to check for intersections with
 * @param points the current list of points in the construction
 * @param newElement the new element being added to the construction
 */
function findIntersections(
  elements: Element[],
  points: ConstructionPoint[],
  newElement: Circle | Line,
): ConstructionPoint[] {
  return produce(points, (draft) => {
    elements.forEach((element) => {
      if (element.type === 'line' || element.type === 'circle') {
        const point1 = Geometry.intersection(element, newElement, true)
        const point2 = Geometry.intersection(element, newElement, false)
        // Ensure the intersection is unique.
        if (draft.every((p) => !Geometry.pointEqual(p, point1))) {
          draft.push({
            ...point1,
            type: 'intersection',
            one: newElement.id,
            two: element.id,
            id: -1,
            neg: true,
          })
        }
        if (draft.every((p) => !Geometry.pointEqual(p, point2))) {
          draft.push({
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
  })
}

/**
 * Add a point to a construction
 * @param construction construction to add to
 * @param point point to add
 */
export function addPoint(construction: Construction, point: Geometry.Point): Construction {
  return produce<Construction, Construction>(construction, ({elements, points}) => {
    const {x, y} = point
    const pointElement: Point = {
      x,
      y,
      id: elements.length,
      type: 'point',
    }

    // Prevent adding a duplicate point or intersection.
    if (points.some((p) => Geometry.pointEqual(p, pointElement))) {
      throw new ConstructionError('Point or intersection already exists.')
    }

    // Have to spread so that the objects are different.
    elements.push({...pointElement})
    points.push({...pointElement})
  })
}

/**
 * Add an intersection to a construction.
 * @param construction construction to add to
 * @param oneIndex the index of the first element of the intersection
 * @param twoIndex the index of the second element of the intersection
 * @param neg whether to use the positive or negative intersection if there are two
 */
function addIntersection(
  construction: Construction,
  oneIndex: number,
  twoIndex: number,
  neg: boolean,
): Construction {
  return produce<Construction, Construction>(construction, ({elements, points}) => {
    const one = elements[oneIndex]
    const two = elements[twoIndex]

    // Both elements must exist.
    if (!one || !two) {
      throw new ConstructionError('Elements to construction intersection do not exist.')
    }

    // Both elements must be lines or circles.
    if (
      (one.type !== 'line' && one.type !== 'circle') ||
      (two.type !== 'line' && two.type !== 'circle')
    ) {
      throw new ConstructionError('Elements to construct intersection must be lines or circles')
    }

    const intersection: Intersection = {
      ...Geometry.intersection(one, two),
      neg,
      type: 'intersection',
      one: oneIndex,
      two: twoIndex,
      id: construction.elements.length,
    }

    // Find the intersection in the points list.
    const index = points.findIndex((p) => Geometry.pointEqual(p, intersection))

    // Have to spread so they are different objects.
    points[index] = {...intersection}
    elements.push({...intersection})
  })
}

/**
 * Adds a line to a construction.
 * @param construction construction to add to
 * @param leftIndex the index of one point on the line
 * @param rightIndex the index of another point on the line
 */
export function addLine(
  construction: Construction,
  leftIndex: number,
  rightIndex: number,
): Construction {
  return produce<Construction, Construction>(construction, (draft) => {
    const {elements, points} = draft
    // Find the points for the line.
    const left = points[leftIndex]
    const right = points[rightIndex]

    // Both points must exist.
    if (!left || !right) {
      throw new ConstructionError('Points to contstruct the line do not exist.')
    }

    const computedLine = Geometry.line(left, right)

    // Prevent duplicate lines.
    if (
      elements.some(
        (element) => element.type === 'line' && Geometry.lineEqual(element, computedLine),
      )
    ) {
      throw new ConstructionError('Line already exists.')
    }

    // Add intersections to construction if not already in.
    if (left.id === -1) {
      left.id = elements.length
      elements.push(left)
    }
    if (right.id === -1) {
      right.id = elements.length
      elements.push(right)
    }

    // Construct the line.
    const line: Line = {
      ...computedLine,
      id: elements.length,
      type: 'line',
      left: left.id,
      right: right.id,
    }

    // Add instersections created by the new line.
    draft.points = findIntersections(elements, points, line)
    elements.push(line)
  })
}

/**
 * Adds a circle to a construction
 * @param construction construction to add to
 * @param centerIndex the index of the center point of the circle
 * @param edgeIndex the index of an edge point of the circle
 */
export function addCircle(
  construction: Construction,
  centerIndex: number,
  edgeIndex: number,
): Construction {
  return produce<Construction, Construction>(construction, (draft) => {
    const {elements, points} = draft
    // Find the points for the line.
    const center = points[centerIndex]
    const edge = points[edgeIndex]

    // Both points must exist.
    if (!center || !edge) {
      throw new ConstructionError('Points to contstruct the circle do not exist.')
    }

    const computedCircle = Geometry.circle(center, edge)

    // Prevent duplicate circles.
    if (
      elements.some(
        (element) => element.type === 'circle' && Geometry.circleEqual(element, computedCircle),
      )
    ) {
      throw new ConstructionError('Circle already exists.')
    }

    // Add intersections to construction if not already in.
    if (center.id === -1) {
      center.id = elements.length
      elements.push(center)
    }
    if (edge.id === -1) {
      edge.id = elements.length
      elements.push(edge)
    }

    // Construct the circle.
    const circle: Circle = {
      ...computedCircle,
      id: elements.length,
      type: 'circle',
      center: center.id,
      edge: edge.id,
    }

    // Add instersections created by the new circle.
    draft.points = findIntersections(elements, points, circle)
    elements.push(circle)
  })
}

/**
 * Build a construction from its minimal form
 * @param initialElements array of elements that define the initial construction
 */
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
