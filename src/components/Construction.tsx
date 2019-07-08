import React, {MouseEventHandler} from 'react'
import {useConstruction} from 'src/contexts/construction'
import Point from 'src/components/Point'
import Line from 'src/components/Line'
import Circle from 'src/components/Circle'

export interface PointClickEvent {
  x: number
  y: number
  elementId?: number
  pointId: number
}

export interface PointClickHandler {
  (e: PointClickEvent): void
}

interface ConstructionProps {
  onPointClick?: PointClickHandler
}

const Construction: React.FC<ConstructionProps> = ({onPointClick = () => {}}) => {
  const {elements, points} = useConstruction()

  const elementNodes = elements.map((el, i) => {
    switch (el.type) {
      case 'line':
        return <Line key={i} a={el.a} b={el.b} c={el.c} />
      case 'circle':
        return <Circle key={i} h={el.h} k={el.k} r={el.r} />
      default:
        return null
    }
  })

  const pointNodes = points.map((p, i) => {
    const onClick: MouseEventHandler = () => {
      onPointClick({
        x: p.x,
        y: p.y,
        elementId: p.id,
        pointId: i,
      })
    }
    return <Point key={i} x={p.x} y={p.y} onClick={onClick} />
  })

  return (
    <>
      {elementNodes}
      {pointNodes}
    </>
  )
}

export default Construction
