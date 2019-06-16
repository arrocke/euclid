import React from 'react'

interface CircleProps {
  cx: number
  cy: number
  ex: number
  ey: number
}

const Circle: React.FC<CircleProps> = ({cx, cy, ex, ey}) => {
  const r = Math.sqrt((cx - ex) ** 2 + (cy - ey) ** 2)
  return <circle cx={cx} cy={cy} r={r} stroke="black" strokeWidth="2" fill="none" />
}

export default Circle
