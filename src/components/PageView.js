import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import EuclidView from '../views/EuclidView'
import HomeView from '../views/HomeView'

function PageView() {
  return <Router>
    <Route exact path="/" component={HomeView}/>
    <Route exact path="/proposition/:id" component={EuclidView}/>
  </Router>
}

export default PageView