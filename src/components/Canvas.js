import React, { Component } from 'react';
import Point from './Point'

class Canvas extends Component {
  constructor(props) {
    super (props)
    this.resize = this.resize.bind(this)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  render () {
    const width = this.state.width
    const height = this.state.height
    const x = -width / 2
    const y = -height / 2
    return <svg width="100%" height="100%" viewBox={`${x} ${y} ${width} ${height}`} >
      <Point x={100} y={-200} />
    </svg>
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
