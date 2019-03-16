import React from 'react'

const TOOLS = ['point', 'circle', 'line']

function Toolbar ({ tool: selected, onToolChange }) {
  const toolButtons = TOOLS.map((tool, i) =>
    <button
      key={i}
      className={`Toolbar-tool ${tool === selected ? 'selected' : ''}`}
      onClick={() => onToolChange(tool)}
    >{tool}</button>
  )
  return <div className="Toolbar">
    {toolButtons}
  </div>
}

export default Toolbar