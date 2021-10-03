import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Button, TextField, Grid } from '@material-ui/core';

class App extends React.Component {
    constructor(props){
      super(props)
      this.state = { csv_path : "" }
      this.handlePathUpdate = this.handlePathUpdate.bind(this)
    }

    handlePathUpdate(path) {
      console.log("updated path: " + path.target.value)
      this.setState({csv_path: path.target.value});
    }

    render() {
        return <div>
        <Grid container justifyContent = "center">
            <TextField id="csv-path" label="Dataset CSV path" variant="outlined" value={this.state.csv_path} onChange={this.handlePathUpdate} />
            <Button variant="contained" onClick={() =>
                {
                    fetch('http://localhost:5000/peoples_speech/upload',
                        {
                            method: 'POST', // *GET, POST, PUT, DELETE, etc.
                            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                            headers: {
                              'Content-Type': 'application/json'
                              // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: JSON.stringify({ csv_path : this.state.csv_path}) // body data type must match "Content-Type" header
                        }
                    )
                    .then(res => res.json())
                    .then((data) => {
                        console.log("Got response: ", data);
                    })
                    .catch(console.log)
                }}>
                Upload
            </Button>
        </Grid>
        </div>;
    }
}

export default App;
