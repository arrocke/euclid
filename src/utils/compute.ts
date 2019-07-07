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

export const floatEqual = (a: number, b: number): boolean => {
  return Math.abs(a - b) < 0.0000001
}

export const distance = ({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): number => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export class ComputeError extends Error {
  public constructor(message: string | undefined) {
    super(message ? `ComputeError: ${message}` : 'ComputeError')
  }
}

export const line = (left: Point, right: Point): Line => {
  return {
    a: left.y - right.y,
    b: right.x - left.x,
    c: left.x * right.y - right.x * left.y,
  }
}

export const circle = (center: Point, edge: Point): Circle => {
  return {
    h: center.x,
    k: center.y,
    r: Math.sqrt((center.x - edge.x) ** 2 + (center.y - edge.y) ** 2),
  }
}

export const intersection = (
  el1: Line | Circle,
  el2: Line | Circle,
  neg: boolean = false,
): Point => {
  // Intersection between lines.
  if (isLine(el1) && isLine(el2)) {
    const {a: a1, b: b1, c: c1} = el1
    const {a: a2, b: b2, c: c2} = el2
    if (floatEqual(b1 / a1, b2 / a2)) {
      // Lines overlap completely when one line's coefficients are a multiple of the other.
      if (floatEqual(c1 / a1, c2 / a2)) {
        throw new ComputeError('Lines overlap at all points.')
      }
      // Lines do not intersect when A and B of one line are multiples of the other, but C is not.
      else {
        throw new ComputeError('Lines do not intersect.')
      }
    }
    const x = (c2 * b1 - c1 * b2) / (a1 * b2 - a2 * b1)
    const y = (c1 * a2 - c2 * a1) / (a1 * b2 - a2 * b1)
    return {x, y}
  }
  // Intersection between circles.
  else if (isCircle(el1) && isCircle(el2)) {
    const {h: h1, k: k1, r: r1} = el1
    const {h: h2, k: k2, r: r2} = el2
    // Circles overlap completely when their centers and radii are the same.
    if (floatEqual(h1, h2) && floatEqual(k1, k2) && floatEqual(r1, r2)) {
      throw new ComputeError('Circles overlap at all points.')
    }
    const d = distance({x: h1, y: k1}, {x: h2, y: k2})
    // Circles do not overlap when the disance between centers is greater than the sum of the radii.
    if (d > r1 + r2) {
      throw new ComputeError('Circles do not intersect.')
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
    if (isCircle(el1)) {
      const temp = el1
      el1 = el2
      el2 = temp
    }
    const {a, b, c} = el1 as Line
    const {h, k, r} = el2 as Circle
    const d = Math.sqrt(r ** 2 - (a * h + b * k + c) ** 2 / (a ** 2 + b ** 2))
    const xc = (b * (b * h - a * k) - a * c) / (a ** 2 + b ** 2)
    const yc = (a * (-b * h + a * k) - b * c) / (a ** 2 + b ** 2)
    const x = xc + (neg ? -1 : 1) * b * Math.sqrt(d ** 2 / (a ** 2 + b ** 2))
    const y = yc + (neg ? 1 : -1) * a * Math.sqrt(d ** 2 / (a ** 2 + b ** 2))
    if (isNaN(x) || isNaN(y)) {
      throw new ComputeError('Circle and line do not intersect.')
    }
    return {x, y}
  }
}
