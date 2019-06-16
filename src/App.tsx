import React from 'react'
import Canvas from 'src/components/Canvas'
import Point from 'src/components/Point'
import Line from 'src/components/Line'
import Circle from 'src/components/Circle'
import {CanvasProvider} from 'src/contexts/canvas'

const App: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <CanvasProvider>
        <Canvas className="w-full h-full">
          <>
            <Point x={-100} y={0} />
            <Point x={100} y={0} />
            <Line a={0} b={1} />
            <Line a={1} b={0} />
            <Line a={1} b={1} />
            <Line a={-1} b={1} />
            <Circle cx={-100} cy={0} ex={100} ey={0} />
            <Circle cx={100} cy={0} ex={-100} ey={0} />
          </>
        </Canvas>
      </CanvasProvider>
    </div>
  )
}

export default App
