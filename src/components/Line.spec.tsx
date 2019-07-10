import React from 'react'
import {renderSVG, fireEvent} from 'src/test-utils'
import Line from 'src/components/Line'
import {CanvasProvider} from 'src/contexts/canvas'

test('renders line with the ends at the sides of the canvas', () => {
  const {svgRoot} = renderSVG(
    <CanvasProvider
      value={{state: {left: -100, top: -100, width: 200, height: 200}, setState: jest.fn()}}
    >
      <Line a={1} b={2} c={3} />
    </CanvasProvider>,
  )
  const line = svgRoot.firstElementChild as SVGElement
  expect(line.tagName).toMatch(/line/i)
  expect(line).toHaveAttribute('x1', '-100')
  expect(line).toHaveAttribute('y1', '-48.5')
  expect(line).toHaveAttribute('x2', '100')
  expect(line).toHaveAttribute('y2', '51.5')
})

test('renders line with the ends at the top and bottom of the canvas', () => {
  const {svgRoot} = renderSVG(
    <CanvasProvider
      value={{state: {left: -100, top: -100, width: 200, height: 200}, setState: jest.fn()}}
    >
      <Line a={-4} b={2} c={3} />
    </CanvasProvider>,
  )
  const line = svgRoot.firstElementChild as SVGElement
  expect(line.tagName).toMatch(/line/i)
  expect(line).toHaveAttribute('x1', '-49.25')
  expect(line).toHaveAttribute('y1', '100')
  expect(line).toHaveAttribute('x2', '50.75')
  expect(line).toHaveAttribute('y2', '-100')
})

test('renders line with the ends in the corners', () => {
  const {svgRoot} = renderSVG(
    <CanvasProvider
      value={{state: {left: -100, top: -100, width: 200, height: 200}, setState: jest.fn()}}
    >
      <Line a={1} b={1} c={0} />
    </CanvasProvider>,
  )
  const line = svgRoot.firstElementChild as SVGElement
  expect(line.tagName).toMatch(/line/i)
  expect(line).toHaveAttribute('x1', '-100')
  expect(line).toHaveAttribute('y1', '-100')
  expect(line).toHaveAttribute('x2', '100')
  expect(line).toHaveAttribute('y2', '100')
})
