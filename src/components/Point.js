import React, { Component } from 'react';

class Point extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  render () {
    return <circle
      cx={this.props.x} cy={-this.props.y}
      r="4"
      onClick={this.onClick}
      onMouseOver={this.onMouseOver}
      onMouseOut={this.onMouseOut}
    />
  }

  eventData () {
    const { elementId, x, y } = this.props
    return { elementId, x, y }
  }

  onClick () {
    this.props.onClick && this.props.onClick(this.eventData())
  }

  onMouseOver () {
    this.props.onMouseOver && this.props.onMouseOver(this.eventData())
  }

  onMouseOut () {
    this.props.onMouseOut && this.props.onMouseOut(this.eventData())
  }
}

export default Point
