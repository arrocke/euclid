import React, { Component } from 'react';
import Point from './Point'

class Canvas extends Component {
  constructor(props) {
    super (props)
    this.resize = this.resize.bind(this)
    this.onCanvasClick = this.onCanvasClick.bind(this)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      elements: [
        { type: 'point', x: 100, y: -200 },
        { type: 'point', x: -100, y: 100 }
      ]
    }
  }

  render () {
    const width = this.state.width
    const height = this.state.height
    const x = -width / 2
    const y = -height / 2

    const elements = this.state.elements.map((el, i) => {
      switch (el.type) {
        case 'point':
          return <Point
            key={i}
            x={el.x} y={el.y}
            elementId={i}
          />
        default:
          return ''
      }
    })

    return <svg
      width="100%" height="100%"
      viewBox={`${x} ${y} ${width} ${height}`}
      onClick={this.onCanvasClick}
    >
      {elements}
    </svg>
  }

  onCanvasClick(e) {
    const x = e.clientX - this.state.width / 2
    const y = -(e.clientY - this.state.height / 2)
    this.setState({
      elements: [
        ...this.state.elements,
        { type: 'point', x, y }
      ]
    })
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  resize () {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
}

export default Canvas