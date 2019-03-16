import React from 'react';

function Point ({ el, onClick }) {
  return <circle
    cx={el.x} cy={-el.y}
    r="4"
    onClick={onClick}
  />
}

export default Point
