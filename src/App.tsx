import React from 'react'
import Editor from 'src/components/Editor'
import {CanvasProvider} from 'src/contexts/canvas'
import {ConstructionProvider} from 'src/contexts/construction'
import {Element} from 'src/types'

const initValue: Element[] = []

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
