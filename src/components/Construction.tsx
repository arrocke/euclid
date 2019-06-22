import React from 'react'
import {useConstruction} from 'src/contexts/construction'
import Point from 'src/components/Point'
import Line from 'src/components/Line'
import Circle from 'src/components/Circle'

const Construction: React.FC = () => {
  const {elements} = useConstruction()

  const elementNodes = elements.map((el, i) => {
    switch (el.type) {
      case 'p':
        return <Point key={i} x={el.x} y={el.y} />
      case 'l':
        return <Line key={i} a={el.a} b={el.b} c={el.c} />
      case 'c':
        return <Circle key={i} h={el.h} k={el.k} r={el.r} />
      case 'i':
        return <Point key={i} x={el.x} y={el.y} />
    }
  })

  return <>{elementNodes}</>
}

export default Construction
