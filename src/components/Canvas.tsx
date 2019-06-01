import React, {useState, useEffect, useRef} from 'react'

interface Props {
  className?: string
  children?: JSX.Element
}

interface Dimensions {
  width: number
  height: number
}

const Canvas: React.FC<Props> = ({className, children}) => {
  const [{width, height}, setDimensions] = useState<Dimensions>({width: 0, height: 0})
  const el = useRef<SVGSVGElement>(null)

  // Update the dimensions of the canvas when the window resizes.
  useEffect(() => {
    const handler = () => {
      if (el && el.current) {
        setDimensions({
          width: el.current.clientWidth,
          height: el.current.clientHeight,
        })
      }
    }
    handler()
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <svg ref={el} width={width} height={height} className={className}>
      {children}
    </svg>
  )
}

export default Canvas
