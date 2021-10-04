import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Button, TextField, Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            jsonlines_path : "s3://peoples-speech/examples/prestamo/prestamo.jsonlines",
            images: [
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ,
                { img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title : "prestamo" } ],
            view: {}
        }
        this.handlePathUpdate = this.handlePathUpdate.bind(this)
    }

    handlePathUpdate(path) {
        console.log("updated path: " + path.target.value)
        this.setState({jsonlines_path: path.target.value});
    }

    render() {
        return <div>
                <Grid container justifyContent = "center">
                    <TextField id="jsonlines-path" label="Dataset jsonlines path" variant="outlined" value={this.state.jsonlines_path} onChange={this.handlePathUpdate} />
                    <Button id="upload" variant="contained" onClick={() =>
                        {
                            fetch('http://localhost:5000/peoples_speech/upload',
                                {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                      // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify({ dataset_path : this.state.jsonlines_path}) // body data type must match "Content-Type" header
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
                <Grid container justifyContent = "center">
                    <Button id="autosplit" variant="contained" onClick={() =>
                        {
                            fetch('http://localhost:5000/peoples_speech/autosplit',
                                {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                      // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify({ view : this.state.view}) // body data type must match "Content-Type" header
                                }
                            )
                            .then(res => res.json())
                            .then((data) => {
                                console.log("Got response: ", data);
                            })
                            .catch(console.log)
                        }}>
                        Split
                    </Button>
                    <Button id="export" variant="contained" onClick={() =>
                        {
                            fetch('http://localhost:5000/peoples_speech/export',
                                {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                      // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify({ view : this.state.view}) // body data type must match "Content-Type" header
                                }
                            )
                            .then(res => res.json())
                            .then((data) => {
                                console.log("Got response: ", data);
                            })
                            .catch(console.log)
                        }}>
                        Export
                    </Button>
                </Grid>
                <Grid container justifyContent = "center">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Train" />
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Test" />
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Raw" />
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Labeled" />
                    </FormGroup>
                </Grid>
                <br />
                <Grid container justifyContent = "center">
                    <ImageList sx={{ width: 1000, height: 450 }} cols={6} rowHeight={164}>
                      {this.state.images.map((item) => (
                        <ImageListItem key={item.img}>
                          <img
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                </Grid>
            </div>;
    }
}

export default App;
