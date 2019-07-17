export interface Point {
  x: number
  y: number
}

export interface Line {
  a: number
  b: number
  c: number
}

export interface Circle {
  h: number
  k: number
  r: number
}

/**
 * Describes an error that occurs during geometric computation.
 */
export class GeometryError extends Error {
  public constructor(message: string | undefined) {
    super(message ? `Compute Error: ${message}` : 'Compute Error')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPoint = (obj: any): obj is Point => {
  return typeof obj.x === 'number' && typeof obj.y === 'number'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLine = (obj: any): obj is Line => {
  return typeof obj.a === 'number' && typeof obj.b === 'number' && typeof obj.c === 'number'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCircle = (obj: any): obj is Circle => {
  return typeof obj.h === 'number' && typeof obj.k === 'number' && typeof obj.r === 'number'
}

/**
 * Determines if two floating point numbers are equal.
 */
export const floatEqual = (a: number, b: number): boolean => {
  return Math.abs(a - b) < 0.0000001
}

/**
 * Computes the distance between two points.
 */
export const distance = (point1: Point, point2: Point): number => {
  const {x: x1, y: y1} = point1
  const {x: x2, y: y2} = point2
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

/**
 * Determines if two points are the same point.
 */
export function pointEqual(point1: Point, point2: Point) {
  return floatEqual(point1.x, point2.x) && floatEqual(point1.y, point2.y)
}

/**
 * Determines if two lines are the same line.
 */
export function lineEqual(line1: Line, line2: Line) {
  return (
    floatEqual(line1.b / line1.a, line2.b / line2.a) &&
    floatEqual(line1.c / line1.a, line2.c / line2.a)
  )
}

/**
 * Determines if two circles are the same circle.
 */
export function circleEqual(circle1: Circle, circle2: Circle) {
  return (
    floatEqual(circle1.h, circle2.h) &&
    floatEqual(circle1.k, circle2.k) &&
    floatEqual(circle1.r, circle2.r)
  )
}

/**
 * Computes the coefficients for a line between two points.
 * @param left a first point on the line
 * @param right a second point on the line
 */
export const line = (left: Point, right: Point): Line => {
  return {
    a: left.y - right.y,
    b: right.x - left.x,
    c: left.x * right.y - right.x * left.y,
  }
}

/**
 * Computes the center and radius of a circle between two points.
 * @param center the center point of the circle
 * @param edge an edge point of the circle
 */
export const circle = (center: Point, edge: Point): Circle => {
  return {
    h: center.x,
    k: center.y,
    r: Math.sqrt((center.x - edge.x) ** 2 + (center.y - edge.y) ** 2),
  }
}

/**
 * Computes the intersection between two elements.
 * @param element1 the first line or circle in the intersection
 * @param element2 the second line or circle in the intersection
 * @param neg whether to use the opposite point if there are two intersections
 */
export const intersection = (
  element1: Line | Circle,
  element2: Line | Circle,
  neg: boolean = false,
): Point => {
  // Intersection between lines.
  if (isLine(element1) && isLine(element2)) {
    const {a: a1, b: b1, c: c1} = element1
    const {a: a2, b: b2, c: c2} = element2
    if (floatEqual(b1 / a1, b2 / a2)) {
      // Lines overlap completely when one line's coefficients are a multiple of the other.
      if (floatEqual(c1 / a1, c2 / a2)) {
        throw new GeometryError('Lines overlap at all points.')
      }
      // Lines do not intersect when A and B of one line are multiples of the other, but C is not.
      else {
        throw new GeometryError('Lines do not intersect.')
      }
    }
    const x = (c2 * b1 - c1 * b2) / (a1 * b2 - a2 * b1)
    const y = (c1 * a2 - c2 * a1) / (a1 * b2 - a2 * b1)
    return {x, y}
  }
  // Intersection between circles.
  else if (isCircle(element1) && isCircle(element2)) {
    const {h: h1, k: k1, r: r1} = element1
    const {h: h2, k: k2, r: r2} = element2
    // Circles overlap completely when their centers and radii are the same.
    if (floatEqual(h1, h2) && floatEqual(k1, k2) && floatEqual(r1, r2)) {
      throw new GeometryError('Circles overlap at all points.')
    }
    const d = distance({x: h1, y: k1}, {x: h2, y: k2})
    // Circles do not overlap when the disance between centers is greater than the sum of the radii.
    if (d > r1 + r2) {
      throw new GeometryError('Circles do not intersect.')
    }
    const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d)
    const h = Math.sqrt(r1 ** 2 - a ** 2)
    const cx = h1 + (a * (h2 - h1)) / d
    const cy = k1 + (a * (k2 - k1)) / d
    const x = cx + ((neg ? 1 : -1) * h * (k2 - k1)) / d
    const y = cy + ((neg ? -1 : 1) * h * (h2 - h1)) / d
    return {x, y}
  }
  // Intersection between a line and circle.
  else {
    // Ensure that the first element is a line and the second a circle.
    if (isCircle(element1)) {
      const temp = element1
      element1 = element2
      element2 = temp
    }
    const {a, b, c} = element1 as Line
    const {h, k, r} = element2 as Circle
    const d = Math.sqrt(r ** 2 - (a * h + b * k + c) ** 2 / (a ** 2 + b ** 2))
    const xc = (b * (b * h - a * k) - a * c) / (a ** 2 + b ** 2)
    const yc = (a * (-b * h + a * k) - b * c) / (a ** 2 + b ** 2)
    const x = xc + (neg ? -1 : 1) * b * Math.sqrt(d ** 2 / (a ** 2 + b ** 2))
    const y = yc + (neg ? 1 : -1) * a * Math.sqrt(d ** 2 / (a ** 2 + b ** 2))
    if (isNaN(x) || isNaN(y)) {
      throw new GeometryError('Circle and line do not intersect.')
    }
    return {x, y}
  }
}
