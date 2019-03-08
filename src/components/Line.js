import React, { Component } from 'react'

class Line extends Component {
  render () {
    const canvasWidth = this.props.canvasWidth
    const canvasHeight = this.props.canvasHeight
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

    const a = this.props.a
    const b = this.props.b

    const m = (b.y - a.y) / (b.x - a.x)
    const y = a.y - a.x * m

    left.y = m * left.x + y
    right.y = m * right.x + y
    top.x = (top.y - y) / m
    bottom.x = (bottom.y - y) / m

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

    return <line x1={points[0].x} y1={-points[0].y} x2={points[1].x} y2={-points[1].y} stroke="black" strokeWidth="2" />
  }
}

export default Line