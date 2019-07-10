import React from 'react'
import {renderSVG, fireEvent} from 'src/test-utils'
import Point from 'src/components/Point'

test('renders circle with center at point coordinates', () => {
  const {svgRoot} = renderSVG(<Point x={10} y={5} />)
  const point = svgRoot.firstElementChild as Element
  expect(point.tagName).toMatch(/circle/i)
  expect(point).toHaveAttribute('cx', '10')
  expect(point).toHaveAttribute('cy', '-5')
})

test('triggers click event when the circle is clicked', () => {
  const clickHandler = jest.fn()
  const {container} = renderSVG(<Point x={10} y={5} onClick={clickHandler} />)
  const point = container.firstElementChild as Element
  fireEvent.click(point)
  expect(clickHandler).toHaveBeenCalled()
})
