import React from 'react'
import {useConstruction} from 'src/contexts/construction'
import Point from 'src/components/Point'
import Line from 'src/components/Line'
import Circle from 'src/components/Circle'

const Construction: React.FC = () => {
  const {elements, points} = useConstruction()

  const elementNodes = elements.map((el, i) => {
    switch (el.type) {
      case 'l':
        return <Line key={i} a={el.a} b={el.b} c={el.c} />
      case 'c':
        return <Circle key={i} h={el.h} k={el.k} r={el.r} />
      default:
        return null
    }
  })

  const pointNodes = points.map((p, i) => {
    return <Point key={i} x={p.x} y={p.y} />
  })

  return (
    <>
      {elementNodes}
      {pointNodes}
    </>
  )
}

export default Construction
