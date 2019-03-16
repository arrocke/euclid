import React from 'react'
import { extendLine } from '../calc'

function Line ({ el, canvasWidth, canvasHeight }) {
  const points = extendLine(
    el.m, el.b,
    -canvasWidth / 2, canvasWidth / 2,
    -canvasHeight / 2, canvasHeight / 2
  )

  return <line
    x1={points[0].x} y1={-points[0].y}
    x2={points[1].x} y2={-points[1].y}
    stroke="black" strokeWidth="2"
  />
}

export default Line