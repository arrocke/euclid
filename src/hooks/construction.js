import { useReducer } from 'react'

const { sqrt, pow, abs } = Math
const sq = (n) => pow(n, 2)
const E = 0.00001

const intersection = (e1, e2, neg) => {
  if (e1.type === 'circle' && e2.type === 'line') {
    const temp = e1
    e1 = e2
    e2 = temp
  }

  if (e1.type === 'line' && e2.type === 'line') {
    // Either line is vertical.
    if (!isNaN(e1.x) || !isNaN(e2.x)) {
      // Second line is vertical.
      if (!isNaN(e1.m)) {
        return {
          x: e2.x,
          y: e1.m * e2.x + e1.b
        }
      }
      // First line is vertical.
      else if (!isNaN(e2.m)) {
        return {
          x: e1.x,
          y: e2.m * e1.x + e2.b
        }
      }
      // Neither is vertical (no intersection).
      else {
        return {}
      }
    }
    // Both lines are of the form y = mx + b. 
    else {
      const x = (e1.b - e2.b) / (e2.m - e1.m)
      const y = e1.m * x + e1.b
      return { x, y }
    }
  } else if (e1.type === 'line' && e2.type === 'circle') {
    // Line is vertical.
    if (!isNaN(e1.x)) {
      const x = e1.x
      const y = e2.cy + (neg ? -1 : 1) * sqrt(sq(e2.r) - sq(x - e2.cx))

      return { x, y }
    }
    // Line is of the form y = mx + b. 
    else {
      const a = 1 + sq(e1.m)
      const b = 2 * (-e2.cx + e1.m * (e1.b - e2.cy))
      const c = sq(e2.cx) + sq(e1.b - e2.cy) - sq(e2.r)

      const x = (-b + (neg ? -1 : 1) * sqrt(sq(b) - 4 * a * c)) / (2 * a)
      const y = e1.m * x + e1.b

      return { x, y }
    }
  } else if (e1.type === 'circle' && e2.type === 'circle') {
    // Circle centers lie on same horizontal line.
    if (abs(e2.cy - e1.cy) < E) {
      const x = (sq(e1.r) - sq(e2.r) - sq(e1.cx) + sq(e2.cx)) / (2 * (e2.cx - e1.cx))
      const y = e1.cy + (neg ? -1 : 1) * sqrt(sq(e1.r) - sq(x - e1.cx))

      return { x, y }
    }
    // Generic case.
    else {
      const bl = (sq(e1.cx) - sq(e2.cx) + sq(e1.cy) - sq(e2.cy) - sq(e1.r) + sq(e2.r)) / (-2 * (e2.cy - e1.cy))
      const m = -(e2.cx - e1.cx) / (e2.cy - e1.cy)

      const a = 1 + sq(m)
      const b = 2 * (-e2.cx + m * (bl - e2.cy))
      const c = sq(e2.cx) + sq(bl - e2.cy) - sq(e2.r)

      const x = (-b + (neg ? -1 : 1) * sqrt(sq(b) - 4 * a * c)) / (2 * a)
      const y = m * x + bl

      return { x, y }
    }


  }
}

const calculateIntersections = ({ elements, intersections }, newElement) => {
  const newIntersections = []
  const points = [
    ...elements.filter(x => x.type === 'point' || x.type === 'intersection'),
    ...intersections
  ]
  const nonPoints = elements.filter(x => x.type === 'circle' || x.type === 'line')
  for (let element of nonPoints) {

    const pos = {
      ...intersection(newElement, element, false),
      type: 'intersection',
      neg: false
    } 
    const neg = {
      ...intersection(newElement, element, true),
      type: 'intersection',
      neg: true
    } 

    const validPoint = (p) =>
      !isNaN(p.x * p.y) && points.every(i => abs(p.x - i.x) > E || abs(p.y - i.y) > E)

    if (validPoint(pos)) {
      newIntersections.push(pos)
      if (validPoint(neg) && (abs(pos.x - neg.x) > E || abs(pos.y - neg.y) > E)) {
        newIntersections.push(neg)
      }
    } else if (validPoint(neg)) {
      newIntersections.push(neg)
    }
  }
  return newIntersections
}

const findPoint = ({ elements, intersections }, id) => {
  if (typeof id === 'string') {
    return intersections[id.split('-')[0]]
  } else if (!isNaN(id)) {
    return elements[id]
  } else {
    return null
  }
}

const reducer = ({ elements, intersections }, { type, x, y, p1, p2 }) => {
  let id = elements.length
  let point1 = findPoint({ elements, intersections }, p1)
  let point2 = findPoint({ elements, intersections }, p2)

  let newElements = []
  let newIntersections = []

  if (point1 && point1.type === 'intersection' && !point1.id) {
    newElements.push({
      ...point1,
      id: id++
    })
  }
  if (point2 && point2.type === 'intersection' && !point2.id) {
    newElements.push({
      ...point2,
      id: id++
    })
  }

  switch (type) {
    case 'point': {
      newElements.push({ type, x, y, id })
      break
    }
    case 'line': {
      let el
      // Vertical line.
      if (Math.abs(point1.x - point2.x) < E) {
        const x = point1.x
        el = { type, p1, p2, x, id }
      }
      // Generic case (y = mx + b). 
      else {
        const m = (point2.y - point1.y) / (point2.x - point1.x)
        const b = point1.y - point1.x * m
        el = { type, p1, p2, m, b, id }
      }
      newElements.push(el)
      newIntersections = calculateIntersections({ elements, intersections, }, el)
      break
    }
    case 'circle': {
      const r = sqrt(sq(point1.x - point2.x) + sq(point1.y - point2.y))
      const el = { type, p1, p2, r, id, cx: point1.x, cy: point1.y }
      newElements.push(el)
      newIntersections = calculateIntersections({ elements, intersections, }, el)
      break
    }
    default: {
      throw new Error(`Cannot add invalid element to construction: ${type}`)
    }
  }

  return {
    elements: [
      ...elements,
      ...newElements
    ],
    intersections: [
      ...intersections.filter(x => x !== point1 && x !== point2),
      ...newIntersections
    ]
  }
}

const useConstruction = (elements = []) => {
  const [state, dispatch] = useReducer(reducer, elements.reduce(reducer, {
    elements: [],
    intersections: []
  }))

  return [state, dispatch]
}

export default useConstruction