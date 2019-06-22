import React from 'react'

interface PointProps {
  x: number
  y: number
}

const Point: React.FC<PointProps> = ({x, y}) => {
  return <circle cx={x} cy={-y} r="3" fill="black" />
}

export default Point
