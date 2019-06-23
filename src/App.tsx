import React from 'react'
import Editor from 'src/components/Editor'
import {CanvasProvider} from 'src/contexts/canvas'
import {ConstructionProvider} from 'src/contexts/construction'
import {Element} from 'src/types'

const initValue: Element[] = [
  {type: 'p', x: 0, y: -100},
  {type: 'p', x: 0, y: 100},
  {type: 'l', left: 0, right: 1},
  {type: 'c', center: 0, edge: 1},
  {type: 'c', center: 1, edge: 0},
  {type: 'i', element1: 3, element2: 4, neg: true},
  {type: 'i', element1: 3, element2: 4, neg: false},
  {type: 'l', left: 5, right: 6},
]

const App: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <CanvasProvider>
        <ConstructionProvider initial={initValue}>
          <Editor />
        </ConstructionProvider>
      </CanvasProvider>
    </div>
  )
}

export default App
