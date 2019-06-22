import React from 'react'
import Canvas from 'src/components/Canvas'
import Construction from 'src/components/Construction'
import {CanvasProvider} from 'src/contexts/canvas'
import {ConstructionProvider, Element} from 'src/contexts/construction'

const initValue: Element[] = [
  {type: 'p', x: 0, y: -100},
  {type: 'p', x: 0, y: 100},
  {type: 'l', left: 0, right: 1},
  {type: 'c', center: 0, edge: 1},
  {type: 'c', center: 1, edge: 0},
  {type: 'i', element1: 3, element2: 4, neg: true},
  {type: 'i', element1: 3, element2: 4, neg: false},
  {type: 'i', element1: 2, element2: 4, neg: false},
  {type: 'i', element1: 2, element2: 3, neg: true},
  {type: 'l', left: 5, right: 6},
  {type: 'i', element1: 9, element2: 2},
]

const App: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <CanvasProvider>
        <ConstructionProvider initial={initValue}>
          <Canvas className="w-full h-full">
            <Construction />
          </Canvas>
        </ConstructionProvider>
      </CanvasProvider>
    </div>
  )
}

export default App
