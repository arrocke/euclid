import React from 'react'

interface CircleProps {
  h: number
  k: number
  r: number
}

const Circle: React.FC<CircleProps> = ({h, k, r}) => {
  return <circle cx={h} cy={-k} r={r} stroke="black" strokeWidth="2" fill="none" />
}

export default Circle
