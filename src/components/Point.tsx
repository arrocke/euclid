import React, {MouseEventHandler} from 'react'

interface PointProps {
  x: number
  y: number
  onClick?: MouseEventHandler
}

const Point: React.FC<PointProps> = ({x, y, onClick = () => {}}) => {
  return <circle cx={x} cy={-y} r="3" fill="black" onClick={onClick} />
}

export default Point
