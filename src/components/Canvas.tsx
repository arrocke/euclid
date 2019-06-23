import React, {useEffect, useRef, MouseEventHandler} from 'react'
import {useCanvasResize, useCanvasDimensions} from 'src/contexts/canvas'

export interface CanvasClickEventHandler {
  (x: number, y: number): void
}

interface CanvasProps {
  className?: string
  onClick?: CanvasClickEventHandler
}

const Canvas: React.FC<CanvasProps> = ({className, onClick = () => {}, children}) => {
  const resize = useCanvasResize()
  const {width, height, left, top} = useCanvasDimensions()
  const el = useRef<SVGSVGElement>(null)

  const onCanvasClick: MouseEventHandler = ({clientX, clientY}) => {
    if (el.current) {
      const bounds = el.current.getBoundingClientRect()
      const x = clientX - bounds.left + left
      const y = -top - (clientY - bounds.top)
      onClick(x, y)
    }
  }

  // Update the dimensions of the canvas when the window resizes.
  useEffect(() => {
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
      onClick={onCanvasClick}
    >
      {width ? children : null}
    </svg>
  )
}

export default Canvas
