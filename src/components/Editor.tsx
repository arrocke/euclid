import React, {useState} from 'react'
import Canvas, {CanvasClickEventHandler} from 'src/components/Canvas'
import Construction from 'src/components/Construction'
import {useConstruction} from 'src/contexts/construction'

enum ActiveToolType {
  none,
  point,
  line,
  circle,
}

const Editor: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveToolType>(ActiveToolType.none)
  const {addPoint} = useConstruction()

  const onCanvasClick: CanvasClickEventHandler = (x, y) => {
    if (activeTool === ActiveToolType.point) {
      addPoint(x, y)
    }
  }

  return (
    <>
      <Canvas className="w-full h-full" onClick={onCanvasClick}>
        <Construction />
      </Canvas>
      <div className="absolute bottom-0 m-4">
        <button onClick={() => setActiveTool(ActiveToolType.point)}>Point</button>
      </div>
    </>
  )
}

export default Editor
