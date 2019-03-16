import React, { useState, useEffect } from 'react';
import Point from './Point'
import Line from './Line'
import Circle from './Circle'
import calculator from '../calculator'

function Canvas({ tool }) {
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [elements, setElements] = useState(calculator.layout([
    { type: 'point', x: 100, y: -200 },
    { type: 'point', x: -100, y: 100 },
  ]))
  const [clickedPoint, setClickedPoint] = useState()

  const onPointClick = (point) => {
    console.log(clickedPoint)
    console.log(point)
    if (tool === 'line' || tool === 'circle') {
      if (clickedPoint && clickedPoint !== point) {
        if (tool === 'line') {
          setElements(calculator.layout([
            ...elements,
            { type: 'line', p1: clickedPoint.id, p2: point.id }
          ]))
        } else {
          setElements(calculator.layout([
            ...elements,
            { type: 'circle', c: clickedPoint.id, e: point.id }
          ]))
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
      setElements(calculator.layout([
        ...elements,
        { type: 'point', x, y }
      ]))
    }
  }

  useEffect(() => {
    const resize = () =>
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })

    window.addEventListener('resize', resize)
    return () =>
      window.removeEventListener('resize', resize)
  }, [])

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
      .filter(({ type }) => type === 'point')
      .map(el => 
        <Point
          key={el.id}
          el={el}
          onClick={() => onPointClick(el)}
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
