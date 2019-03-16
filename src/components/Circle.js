import React from 'react'

function Circle({ el }) {
  return <circle
    cx={el.cx} cy={-el.cy}
    r={el.r}
    fill="transparent" stroke="black" strokeWidth="2"
  />
}

export default Circle
