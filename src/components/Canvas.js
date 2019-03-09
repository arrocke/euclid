import React, { Component } from 'react';
import Point from './Point'
import Line from './Line'
import Circle from './Circle'
import calculator from '../calculator'

class Canvas extends Component {
  constructor(props) {
    super (props)
    this.resize = this.resize.bind(this)
    this.onCanvasClick = this.onCanvasClick.bind(this)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      elements: calculator.layout([
        { type: 'point', x: 100, y: -200 },
        { type: 'point', x: -100, y: 100 },
        { type: 'circle', c: 0, e: 1},
        { type: 'circle', c: 1, e: 0},
        { type: 'intersection', e1: 2, e2: 3, neg: true },
        { type: 'line', p1: 0, p2: 4 },
        { type: 'line', p1: 1, p2: 4 },
        { type: 'line', p1: 1, p2: 0 }
      ])
    }
  }

  render () {
    const width = this.state.width
    const height = this.state.height
    const x = -width / 2
    const y = -height / 2

    const elements = this.state.elements.map((el, i) => {
      switch (el.type) {
        case 'intersection':
        case 'point':
          return <Point
            key={el.id}
            el={el}
          />
        case 'line':
          return <Line
            key={el.id}
            el={el}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
          />
        case 'circle':
          return <Circle
            key={el.id}
            el={el}
          />
        default:
          return null
      }
    }).filter(el => el !== null)

    return <svg
      width="100%" height="100%"
      viewBox={`${x} ${y} ${width} ${height}`}
      onClick={this.onCanvasClick}
    >
      {elements}
    </svg>
  }

  onCanvasClick(e) {
  }

  findElement(id) {
    return this.state.elements[id]
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
    this.forceUpdate()
  }
}

export default Canvas
