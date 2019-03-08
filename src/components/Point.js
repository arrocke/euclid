import React, { Component } from 'react';

class Point extends Component {
  render () {
    return <circle cx={this.props.x} cy={-this.props.y} r="4" />
  }
}

export default Point
