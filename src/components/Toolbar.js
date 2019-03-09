import React, { Component } from 'react'

const TOOLS = ['point', 'circle', 'line']

class Toolbar extends Component {
  render() {
    const toolButtons = TOOLS.map((tool, i) =>
      <button
        key={i}
        className={`Toolbar-tool ${this.props.tool === tool ? 'selected' : ''}`}
        onClick={() => this.props.onToolChange(tool)}
      >{tool}</button>
    )
    return <div className="Toolbar">
      {toolButtons}
    </div>
  }
}

export default Toolbar