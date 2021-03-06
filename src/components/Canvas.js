import React, { useState } from 'react';
import Point from './Point'
import Line from './Line'
import Circle from './Circle'
import CanvasContext from '../contexts/canvas'
import useConstruction from '../hooks/construction'
import useWindowSize from '../hooks/windowSize'

function Canvas({ tool, construction = [] }) {
  const { width, height } = useWindowSize()
  const [{ elements, intersections}, dispatch] = useConstruction(construction)
  const [clickedPoint, setClickedPoint] = useState(null)

  const onPointClick = (point) => {
    if (tool === 'line' || tool === 'circle') {
      if (clickedPoint != null && clickedPoint !== point) {
        if (tool === 'line') {
          dispatch({
            type: 'line',
            p1: clickedPoint,
            p2: point
          })
        } else {
          dispatch({
            type: 'circle',
            p1: clickedPoint,
            p2: point
          })
        }
        setClickedPoint(null)
      } else {
        setClickedPoint(point)
      }
    }
  }

  const onCanvasClick = (e) => {
    if (tool === 'point') {
      const x = e.clientX - width / 2
      const y = -(e.clientY - height / 2)
      dispatch({ type: 'point', x, y })
    }
  }

  const els = [
    ...elements
      .filter(({ type }) => type === 'circle')
      .map(el =>
        <Circle
          key={el.id}
          cx={el.cx} cy={el.cy}
          r={el.r}
        />),
    ...elements
      .filter(({ type }) => type === 'line')
      .map(el => 
        <Line
          key={el.id}
          m={el.m} b={el.b} x={el.x}
        />),
    ...elements
      .filter(({ type }) => type === 'point' || type === 'intersection')
      .map(el => 
        <Point
          key={el.id}
          x={el.x} y={el.y}
          onClick={() => onPointClick(el.id)}
        />),
    ...intersections
      .map((el, i) => 
        <Point
          key={`${i}-i`}
          x={el.x} y={el.y}
          onClick={() => onPointClick(`${i}-i`)}
        />)
  ]

  return <svg
    width="100%" height="100%"
    viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    onClick={onCanvasClick}
  >
    <CanvasContext.Provider value={{ width, height }}>
      {els}
    </CanvasContext.Provider>
  </svg>
}

export default Canvas
