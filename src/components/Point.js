import React from 'react';

function Point ({ x, y, onClick }) {
  return <circle
    cx={x} cy={-y}
    r="4"
    onClick={onClick}
  />
}

export default Point
