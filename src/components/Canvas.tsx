import React, {useEffect, useRef} from 'react'
import {useCanvasResize, useCanvasDimensions} from 'src/contexts/canvas'

interface CanvasProps {
  className?: string
  children?: JSX.Element
}

const Canvas: React.FC<CanvasProps> = ({className, children}) => {
  const resize = useCanvasResize()
  const {width, height, left, top} = useCanvasDimensions()
  const el = useRef<SVGSVGElement>(null)

  // Update the dimensions of the canvas when the window resizes.
  useEffect(() => {
    console.log('use-effect')
    const handler = () => {
      if (el && el.current) {
        resize({
          width: el.current.clientWidth,
          height: el.current.clientHeight,
          left: -el.current.clientWidth / 2,
          top: -el.current.clientHeight / 2,
        })
      }
    }
    handler()
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [resize, el])

  return (
    <svg
      ref={el}
      width={width}
      height={height}
      className={className}
      viewBox={`${left} ${top} ${width} ${height}`}
    >
      {width ? children : null}
    </svg>
  )
}

export default Canvas
