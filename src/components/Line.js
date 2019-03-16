import React from 'react'

function Line ({ el, canvasWidth, canvasHeight }) {
  const left = {
    x: -canvasWidth / 2
  }
  const right = {
    x: -left.x
  }
  const top = {
    y: canvasHeight / 2
  }
  const bottom = {
    y: -top.y
  }

  left.y = el.m * left.x + el.b
  right.y = el.m * right.x + el.b
  top.x = (top.y - el.b) / el.m
  bottom.x = (bottom.y - el.b) / el.m

  const points = []

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

  return <line
    x1={points[0].x} y1={-points[0].y}
    x2={points[1].x} y2={-points[1].y}
    stroke="black" strokeWidth="2"
  />
}

export default Line