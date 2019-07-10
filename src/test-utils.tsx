import React from 'react'
import * as TestingLibrary from '@testing-library/react'

export * from '@testing-library/react'

export interface RenderResult extends TestingLibrary.RenderResult {
  svgRoot: SVGElement
}

export function renderSVG(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ui: React.ReactElement<any>,
  options: TestingLibrary.RenderOptions = {},
): RenderResult {
  const utils = TestingLibrary.render(<svg>{ui}</svg>, options)
  return {
    ...utils,
    svgRoot: utils.container.firstChild as SVGElement,
  }
}
