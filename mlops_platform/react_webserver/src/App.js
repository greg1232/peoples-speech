import './App.css';

import React from 'react';

import Login from './components/Login'
import Main from './components/Main'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token : null
        };

        this.setToken = this.setToken.bind(this);
    }

    setToken(token) {
        this.setState({ token : token });
    }

    componentDidMount(){
      document.title = "SayData"
    }

    render() {
        if (!this.state.token) {
            return <Login setToken={this.setToken} />
        }

        return <Main setToken={this.setToken} />;
    }
}

export default App;
