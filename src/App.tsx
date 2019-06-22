import React from 'react'
import Canvas from 'src/components/Canvas'
import Construction from 'src/components/Construction'
import {CanvasProvider} from 'src/contexts/canvas'

const App: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <CanvasProvider>
        <Canvas className="w-full h-full">
          <Construction />
        </Canvas>
      </CanvasProvider>
    </div>
  )
}

export default App
