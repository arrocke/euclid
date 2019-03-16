import React from 'react'

const extendLine = (m, b, minX, maxX, minY, maxY) => {
  const points = []
  const left = {
    x: minX,
    y: m * minX + b
  }
  const right = {
    x: maxX,
    y: m * maxX + b
  }
  const top = {
    x: (minY - b) / m,
    y: minY
  }
  const bottom = {
    x: (maxY - b) / m,
    y: maxY
  }

  if (top.y >= left.y >= bottom.y) {
    points.push(left)
  }
  if (top.y >= right.y >= bottom.y) {
    points.push(right)
  }
  if (right.x >= top.x >= left.x) {
    points.push(top)
  }
  if (right.x >= bottom.x >= left.x) {
    points.push(bottom)
  }

  return points
}

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