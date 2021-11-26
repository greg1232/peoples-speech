import React from 'react';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Button } from '@material-ui/core';

import Header from './Header'
import MyButton from './Footer'
import DataManager from './DataManager'
import ModelIteration from './ModelIteration'
import Home from './Home'
import Deploy from './Deploy'

export default class Main extends React.Component {

    render() {
        return (
            <div>
                <Header setToken={this.props.setToken} />
                    <BrowserRouter>
                        <Link to="/" style={{ textDecoration: 'none' }} ><Button color="inherit">Home</Button></Link>
                        <Link to="/data" style={{ textDecoration: 'none' }} ><Button color="inherit">Data</Button></Link>
                        <Link to="/model" style={{ textDecoration: 'none' }} ><Button color="inherit">Model</Button></Link>
                        <Link to="/deploy" style={{ textDecoration: 'none' }} ><Button color="inherit">Deploy</Button></Link>

                        <hr />

                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route path="/data" element={<DataManager />} />
                            <Route path="/model" element={<ModelIteration />} />
                            <Route path="/deploy" element={<Deploy />} />
                        </Routes>
                    </BrowserRouter>
                <MyButton />
            </div>
        );
    }
}

