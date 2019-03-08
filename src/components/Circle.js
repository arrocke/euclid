import React, { Component } from 'react'

class Circle extends Component {
  render () {
    const c = this.props.c
    const e = this.props.e

    const r = Math.sqrt(Math.pow(c.x - e.x, 2) + Math.pow(c.y - e.y, 2))

    return <circle cx={c.x} cy={-c.y} r={r} fill="transparent" stroke="black" strokeWidth="2" />
  }
}

export default Circle
