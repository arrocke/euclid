import { useReducer } from 'react'

const {sqrt, pow} = Math
const sq = (n) => pow(n, 2)

const reducer = (elements, { type, x, y, p1, p2 }) => {
  let point1 = !isNaN(p1) ? elements[p1] : null
  let point2 = !isNaN(p2) ? elements[p2] : null
  let element
  switch (type) {
    case 'point': {
      element = { type, x, y }
      break
    }
    case 'line': {
      const m = (point2.y - point1.y) / (point2.x - point1.x)
      const b = point1.y - point1.x * m
      element = { type, p1, p2, m, b }
      break
    }
    case 'circle': {
      const r = sqrt(sq(point1.x - point2.x) + sq(point1.y - point2.y))
      element = { type, p1, p2, r, cx: point1.x, cy: point1.y }
      break
    }
    default: {
      throw new Error(`Cannot add invalid element to construction: ${type}`)
    }
  }
  return [
    ...elements,
    {
      ...element,
      id: elements.length
    }
  ]
}

const useConstruction = (initialElements) => {
  const [elements, dispatch] = useReducer(reducer, initialElements)

  return [elements, dispatch]
}

export default useConstruction