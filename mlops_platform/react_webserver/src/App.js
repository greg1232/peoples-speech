import './App.css';

import React from 'react';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Button } from '@material-ui/core';

import ButtonAppBar from './components/Header'
import MyButton from './components/Footer'
import DataManager from './components/DataManager'
import ModelIteration from './components/ModelIteration'
import Home from './components/Home'
import Deploy from './components/Deploy'

class App extends React.Component {
    componentDidMount(){
      document.title = "The People's Speech Platform"
    }

    render() {
        return (
            <div>
                <ButtonAppBar />
                    <BrowserRouter>
                        <Link to="/"><Button color="inherit">Home</Button></Link>
                        <Link to="/data"><Button color="inherit">Data</Button></Link>
                        <Link to="/model"><Button color="inherit">Model</Button></Link>
                        <Link to="/deploy"><Button color="inherit">Deploy</Button></Link>

                        <hr />

                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route path="/data" element={<DataManager/>} />
                            <Route path="/model" element={<ModelIteration/>} />
                            <Route path="/deploy" element={<Deploy/>} />
                        </Routes>
                    </BrowserRouter>
                <MyButton />
            </div>
        );
    }
}

export default App;
