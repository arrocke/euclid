import React, { useState } from 'react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import data from '../data.json'

function EuclidView ({ match }) {
  const construction = data[parseInt(match.params.id) - 1] || []
  const [tool, setTool] = useState()

  return (
    <div className="EuclidView">
      <Canvas tool={tool} construction={construction}/>
      <Toolbar tool={tool} onToolChange={setTool}/>
    </div>
  );
}

export default EuclidView;
