import React from 'react'

function Circle({ cx, cy, r }) {
  return <circle
    cx={cx} cy={-cy}
    r={r}
    fill="transparent" stroke="black" strokeWidth="2"
  />
}

export default Circle
