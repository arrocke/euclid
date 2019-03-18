import React from 'react'

const genericLine = (m, b, minX, maxX, minY, maxY) => {
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

  if (maxY >= left.y >= minY) {
    points.push(left)
  }
  if (maxY >= right.y >= minY) {
    points.push(right)
  }
  if (maxX >= top.x >= minX) {
    points.push(top)
  }
  if (maxX >= bottom.x >= minX) {
    points.push(bottom)
  }

  return <line
    x1={points[0].x} y1={-points[0].y}
    x2={points[1].x} y2={-points[1].y}
    stroke="black" strokeWidth="2"
  />
}

const verticalLine = (x) => {
  return <line
    x1={x} y1="-50%"
    x2={x} y2="50%"
    stroke="black" strokeWidth="2"
  />
}

function Line ({ el, canvasWidth, canvasHeight }) {
  if (isNaN(el.x)) {
    return genericLine(
      el.m, el.b,
      -canvasWidth / 2, canvasWidth / 2,
      -canvasHeight / 2, canvasHeight / 2
    )
  } else {
    return verticalLine(el.x)
  }
}

export default Line