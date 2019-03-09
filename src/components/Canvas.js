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
    this.onPointClick = this.onPointClick.bind(this)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      elements: calculator.layout([
        { type: 'point', x: 100, y: -200 },
        { type: 'point', x: -100, y: 100 },
      ])
    }
  }

  render () {
    const width = this.state.width
    const height = this.state.height
    const x = -width / 2
    const y = -height / 2

    const elements = [
      ...this.state.elements
        .filter(({ type }) => type === 'circle')
        .map(el =>
          <Circle
            key={el.id}
            el={el}
          />),
      ...this.state.elements
        .filter(({ type }) => type === 'line')
        .map(el => 
          <Line
            key={el.id}
            el={el}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
          />),
      ...this.state.elements
        .filter(({ type }) => type === 'point')
        .map(el => 
          <Point
            key={el.id}
            el={el}
            onClick={this.onPointClick}
          />)
    ]

    return <svg
      width="100%" height="100%"
      viewBox={`${x} ${y} ${width} ${height}`}
      onClick={this.onCanvasClick}
    >
      {elements}
    </svg>
  }

  onCanvasClick(e) {
    if (this.props.tool === 'point') {
      const x = e.clientX - this.state.width / 2
      const y = -(e.clientY - this.state.height / 2)
      this.setState({
        elements: calculator.layout([
          ...this.state.elements,
          { type: 'point', x, y }
        ])
      })
    }
  }

  onPointClick(point) {
    if (this.props.tool === 'line' || this.props.tool === 'circle') {
      if (this.state.clickedPoint && this.state.clickedPoint !== point) {
        if (this.props.tool === 'line') {
          this.setState({
            elements: calculator.layout([
              ...this.state.elements,
              { type: 'line', p1: this.state.clickedPoint.id, p2: point.id }
            ])
          })
        } else {
          this.setState({
            elements: calculator.layout([
              ...this.state.elements,
              { type: 'circle', c: this.state.clickedPoint.id, e: point.id }
            ])
          })
        }
        this.setState({
          clickedPoint: null
        })
      } else {
        this.setState({
          clickedPoint: point
        })
      }
    }
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
