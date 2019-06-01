import React from 'react'
import Canvas from './components/Canvas'

const App: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <Canvas className="w-full h-full" />
    </div>
  )
}

export default App
