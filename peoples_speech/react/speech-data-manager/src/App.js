import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button } from '@material-ui/core';

import ButtonAppBar from './components/Header'
import MyButton from './components/Footer'
import DataManager from './components/DataManager'
import ModelIteration from './components/ModelIteration'
import Home from './components/Home'
import Deploy from './components/Deploy'

class App extends React.Component {
    componentDidMount(){
      document.title = "Peoples Speech Platform"
    }

    render() {
        return (
            <div>
                <ButtonAppBar />
                    <Router>
                        <div>
                              <Link to="/"><Button color="inherit">Home</Button></Link>
                              <Link to="/data"><Button color="inherit">Data</Button></Link>
                              <Link to="/model"><Button color="inherit">Model</Button></Link>
                              <Link to="/deploy"><Button color="inherit">Deploy</Button></Link>

                          <hr />

                          <Route exact path="/" component={Home} />
                          <Route path="/data" component={DataManager} />
                          <Route path="/model" component={ModelIteration} />
                          <Route path="/deploy" component={Deploy} />
                        </div>
                    </Router>
                <MyButton/>
            </div>
        );
    }
}

export default App;
