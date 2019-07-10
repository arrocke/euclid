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
  expect(line.getAttribute('x1')).toEqual('-100')
  expect(line.getAttribute('y1')).toEqual('-48.5')
  expect(line.getAttribute('x2')).toEqual('100')
  expect(line.getAttribute('y2')).toEqual('51.5')
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
  expect(line.getAttribute('x1')).toEqual('-49.25')
  expect(line.getAttribute('y1')).toEqual('100')
  expect(line.getAttribute('x2')).toEqual('50.75')
  expect(line.getAttribute('y2')).toEqual('-100')
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
  expect(line.getAttribute('x1')).toEqual('-100')
  expect(line.getAttribute('y1')).toEqual('-100')
  expect(line.getAttribute('x2')).toEqual('100')
  expect(line.getAttribute('y2')).toEqual('100')
})
