import React, {useState} from 'react'
import Canvas, {CanvasClickEventHandler} from 'src/components/Canvas'
import Construction, {PointClickHandler, PointClickEvent} from 'src/components/Construction'
import {useConstruction} from 'src/contexts/construction'

enum ActiveToolType {
  none,
  point,
  line,
  circle,
}

const Editor: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveToolType>(ActiveToolType.none)
  const [clickedPoint, setClickedPoint] = useState<PointClickEvent | null>(null)
  const {addPoint, addLine, addCircle} = useConstruction()

  const onCanvasClick: CanvasClickEventHandler = (x, y) => {
    if (activeTool === ActiveToolType.point) {
      addPoint(x, y)
    }
  }

  const onPointClick: PointClickHandler = (point) => {
    if (clickedPoint !== null && clickedPoint.pointId !== point.pointId) {
      if (activeTool === ActiveToolType.line) {
        addLine(clickedPoint.pointId, point.pointId)
        setClickedPoint(null)
      } else if (activeTool === ActiveToolType.circle) {
        addCircle(clickedPoint.pointId, point.pointId)
        setClickedPoint(null)
      }
    } else if ([ActiveToolType.circle, ActiveToolType.line].includes(activeTool)) {
      setClickedPoint(point)
    }
  }

  return (
    <>
      <Canvas className="w-full h-full" onClick={onCanvasClick}>
        <Construction onPointClick={onPointClick} />
      </Canvas>
      <div className="absolute bottom-0 m-4">
        <button onClick={() => setActiveTool(ActiveToolType.point)}>Point</button>
        <button onClick={() => setActiveTool(ActiveToolType.line)}>Line</button>
        <button onClick={() => setActiveTool(ActiveToolType.circle)}>Circle</button>
      </div>
    </>
  )
}

export default Editor
