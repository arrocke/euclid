import React, { useState, useEffect } from 'react';
import Point from './Point'
import Line from './Line'
import Circle from './Circle'
import { line, circle, allIntersections } from '../calc'

function Canvas({ tool }) {
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [elements, setElements] = useState([])
  const [intersections, setIntersections] = useState([])
  const [clickedPoint, setClickedPoint] = useState()

  const onPointClick = (point) => {
    if (tool === 'line' || tool === 'circle') {
      if (clickedPoint && clickedPoint !== point) {
        let el
        if (tool === 'line') {
          el = {
            ...line(elements[clickedPoint.id], elements[point.id]),
            id: elements.length,
            type: 'line',
            p1: clickedPoint.id,
            p2: point.id
          }
        } else {
          el = {
            ...circle(elements[clickedPoint.id], elements[point.id]),
            id: elements.length,
            type: 'circle',
            c: clickedPoint.id,
            e: point.id
          }
        }
        setElements([
          ...elements,
          el
        ])
        setIntersections([
          ...intersections,
          ...allIntersections(el, elements),
        ])
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
      setElements([
        ...elements,
        {
          x, y,
          id: elements.length,
          type: 'point'
        }
      ])
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
        />),
    ...intersections
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
