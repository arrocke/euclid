import React from 'react'
import {renderSVG} from 'src/test-utils'
import Circle from 'src/components/Circle'

test('renders circle from parameters', () => {
  const {svgRoot} = renderSVG(<Circle h={10} k={5} r={2} />)
  const circle = svgRoot.firstElementChild as Element
  expect(circle.tagName).toMatch(/circle/i)
  expect(circle).toHaveAttribute('cx', '10')
  expect(circle).toHaveAttribute('cy', '-5')
  expect(circle).toHaveAttribute('r', '2')
})
