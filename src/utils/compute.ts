interface Point {
  x: number
  y: number
}

interface Line {
  a: number
  b: number
  c: number
}

interface Circle {
  h: number
  k: number
  r: number
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

export const circleIntersection = (
  circle1: Circle,
  circle2: Circle,
  neg: boolean = false,
): Point => {
  const {h: h1, k: k1, r: r1} = circle1
  const {h: h2, k: k2, r: r2} = circle2
  const d = Math.sqrt((h1 - h2) ** 2 + (k1 - k2) ** 2)
  const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d)
  const h = Math.sqrt(r1 ** 2 - a ** 2)
  const cx = h1 + (a * (h2 - h1)) / d
  const cy = k1 + (a * (k2 - k1)) / d
  const x = cx + ((neg ? 1 : -1) * h * (k2 - k1)) / d
  const y = cy + ((neg ? -1 : 1) * h * (h2 - h1)) / d
  return {x, y}
}

export const lineIntersection = (line1: Line, line2: Line): Point => {
  const {a: a1, b: b1, c: c1} = line1
  const {a: a2, b: b2, c: c2} = line2
  const x = (c2 * b1 - c1 * b2) / (a1 * b2 - a2 * b1)
  const y = (c2 * a1 - c1 * a2) / (a1 * b2 - a2 * b1)
  return {x, y}
}

export const circleLineIntersection = (circle: Circle, line: Line, neg: boolean = false): Point => {
  const {a, b, c} = line
  const {h, k, r} = circle
  const d = Math.sqrt(r ** 2 - (a * h + b * k + c) ** 2 / (a ** 2 + b ** 2))
  const x = (b * (b * h - a * k) - a * c + (neg ? -1 : 1) * b * d ** 2) / (a ** 2 + b ** 2)
  const y = (a * (-b * h + a * k) - b * c + (neg ? 1 : -1) * a * d ** 2) / (a ** 2 + b ** 2)
  return {x, y}
}
