import React, { Component } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tool: null
    }
  }
  
  render() {
    return (
      <div className="App">
        <Canvas tool={this.state.tool} />
        <Toolbar tool={this.state.tool} onToolChange={tool => this.setState({ tool })}/>
      </div>
    );
  }
}

export default App;
