import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App () {
  const [tool, setTool] = useState()
  
  return (
    <div className="App">
      <Canvas tool={tool} />
      <Toolbar tool={tool} onToolChange={setTool}/>
    </div>
  );
}

export default App;
