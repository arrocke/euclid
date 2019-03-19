import React, { useState } from 'react';
import Point from './Point'
import Line from './Line'
import Circle from './Circle'
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
          el={el}
        />),
    ...elements
      .filter(({ type }) => type === 'line')
      .map(el => 
        <Line
          key={el.id}
          el={el}
          canvasWidth={width}
          canvasHeight={height}
        />),
    ...elements
      .filter(({ type }) => type === 'point' || type === 'intersection')
      .map(el => 
        <Point
          key={el.id}
          el={el}
          onClick={() => onPointClick(el.id)}
        />),
    ...intersections
      .map((el, i) => 
        <Point
          key={`${i}-i`}
          el={el}
          onClick={() => onPointClick(`${i}-i`)}
        />)
  ]

  return <svg
    width="100%" height="100%"
    viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    onClick={onCanvasClick}
  >
    {els}
  </svg>
}

export default Canvas
