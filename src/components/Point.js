import React, { Component } from 'react';

class Point extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  render () {
    const el = this.props.el
    return <circle
      cx={el.x} cy={-el.y}
      r="4"
      onClick={this.onClick}
      onMouseOver={this.onMouseOver}
      onMouseOut={this.onMouseOut}
    />
  }

  onClick () {
    this.props.onClick && this.props.onClick(this.props.el)
  }

  onMouseOver () {
    // this.props.onMouseOver && this.props.onMouseOver(this.eventData())
  }

  onMouseOut () {
    // this.props.onMouseOut && this.props.onMouseOut(this.eventData())
  }
}

export default Point
