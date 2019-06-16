import React from 'react'
import {useCanvasDimensions} from 'src/contexts/canvas'

interface LineProps {
  a: number
  b: number
}

// Calculate X and Y values using the equation 1 = AX + BY.
const calcX = (a: number, b: number, y: number) => (a ? (b * y) / -a : Infinity)
const calcY = (a: number, b: number, x: number) => (b ? (a * x) / b : Infinity)

const Line: React.FC<LineProps> = ({a, b}) => {
  const {width, height, left: minX, top: minY} = useCanvasDimensions()

  const maxX = minX + width
  const maxY = minY + height

  // Generate a point along each edge of the canvas.
  // Then get the two points that are not outside of the canvas.
  const [{x: x1, y: y1}, {x: x2, y: y2}] = [
    {y: calcY(a, b, minX), x: minX},
    {y: calcY(a, b, maxX), x: maxX},
    {x: calcX(a, b, minY), y: minY},
    {x: calcX(a, b, maxY), y: maxY},
  ].filter(({x, y}) => minX <= x && x <= maxX && minY <= y && y <= maxY)

  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
}

export default Line
