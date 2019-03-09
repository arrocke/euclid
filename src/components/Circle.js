import React, { Component } from 'react'

class Circle extends Component {
  render () {
    const el = this.props.el
    return <circle
      cx={el.cx} cy={-el.cy}
      r={el.r}
      fill="transparent" stroke="black" strokeWidth="2"
    />
  }
}

export default Circle
