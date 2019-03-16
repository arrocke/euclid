// Point: { type: 'point', x, y }
// Line: { type: 'line', p1, p2 }
// Circle: { type: 'circle', c, e }
// Intersection: { type: 'intersection', e1, e2 }

const E = 0.00001
const { pow, sqrt, abs } = Math

export const line = (p1, p2) => {
  const m = (p2.y - p1.y) / (p2.x - p1.x)
  const b = p1.y - p1.x * m
  return { m, b }
}

export const extendLine = (m, b, minX, maxX, minY, maxY) => {
  const points = []
  const left = {
    x: minX,
    y: m * minX + b
  }
  const right = {
    x: maxX,
    y: m * maxX + b
  }
  const top = {
    x: (minY - b) / m,
    y: minY
  }
  const bottom = {
    x: (maxY - b) / m,
    y: maxY
  }

  if (top.y >= left.y >= bottom.y) {
    points.push(left)
  }
  if (top.y >= right.y >= bottom.y) {
    points.push(right)
  }
  if (right.x >= top.x >= left.x) {
    points.push(top)
  }
  if (right.x >= bottom.x >= left.x) {
    points.push(bottom)
  }

  return points
}

export const circle = (c, e) => {
  const r = sqrt(pow(c.x - e.x, 2) + pow(c.y - e.y, 2)
  )
  return {
    cx: c.x,
    cy: c.y,
    r
  }
}

export const intersection = (e1, e2, neg) => {
  if (e1.type === 'circle' && e2.type === 'line') {
    const temp = e1
    e1 = e2
    e2 = temp
  }

  if (e1.type === 'line' && e2.type === 'line') {
    const x = (e1.b - e2.b) / (e2.m - e1.m)
    const y = e1.m * x + e1.b
    return { x, y }
  } else if (e1.type === 'line' && e2.type === 'circle') {
    const a = 1 + pow(e1.m, 2)
    const b = 2 * (-e2.cx + e1.m * (e1.b - e2.cy))
    const c = pow(e2.cx, 2) + pow(e1.b - e2.cy, 2) - pow(e2.r, 2)

    const x = (-b + (neg ? -1 : 1) * sqrt(pow(b, 2) - 4 * a * c)) / (2 * a)
    const y = e1.m * x + e1.b

    return { x, y }
  } else if (e1.type === 'circle' && e2.type === 'circle') {
    const bl = (pow(e1.cx, 2) - pow(e2.cx, 2) + pow(e1.cy, 2) - pow(e2.cy, 2) - pow(e1.r, 2) + pow(e2.r, 2)) / (-2 * (e2.cy - e1.cy))
    const m = -(e2.cx - e1.cx) / (e2.cy - e1.cy)

    const a = 1 + pow(m, 2)
    const b = 2 * (-e2.cx + m * (bl - e2.cy))
    const c = pow(e2.cx, 2) + pow(bl - e2.cy, 2) - pow(e2.r, 2)

    const x = (-b + (neg ? -1 : 1) * sqrt(pow(b, 2) - 4 * a * c)) / (2 * a)
    const y = m * x + bl

    return { x, y }
  }
}

export const allIntersections = (e1, elements) =>
  elements.reduce((acc, e2) => {
    if (e2.type === 'point') {
      return acc
    }

    const pos = {
      ...intersection(e1, e2, true),
      e1, e2,
      neg: true
    }
    const neg = {
      ...intersection(e1, e2, false),
      e1, e2,
      neg: false
    }

    if (abs(pos.x - neg.x) < E && abs(pos.y - neg.y) < E) {
      return [
        ...acc,
        pos
      ]
    } else {
      return [
        ...acc,
        pos,
        neg
      ]
    }
  }, [])
