
import React from 'react';
import { TextField, Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox, Button } from '@material-ui/core';

export default class DataManager extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            jsonlines_path : "s3://peoples-speech/examples/prestamo/prestamo.jsonlines",
            images: [ ],
            view: {
                split: {
                    train : false,
                    test : false
                },
                labels: {
                    labeled : true
                }
            }
        }
        this.handlePathUpdate = this.handlePathUpdate.bind(this);
        this.handleImagesUpdate = this.handleImagesUpdate.bind(this);
        this.handleTrainUpdate = this.handleTrainUpdate.bind(this);
        this.handleTestUpdate = this.handleTestUpdate.bind(this);
        this.handleLabeledUpdate = this.handleLabeledUpdate.bind(this);
    }

    handlePathUpdate(path) {
        console.log("updated path: " + path.target.value);
        this.setState({jsonlines_path: path.target.value});
    }

    handleImagesUpdate(data) {
        let new_images = data["images"].map((path) => ({img: path, title: "uploaded"}));
        this.setState({images: new_images});
    }

    handleTrainUpdate() {
        console.log("updated train: ");
        var view = {...this.state.view};
        view.split.train = !view.split.train;
        this.setState({view});
        this.getView(view);
    }

    handleTestUpdate() {
        console.log("updated test: ");
        var view = {...this.state.view};
        view.split.test = !view.split.test;
        this.setState({view});
        this.getView(view);
    }

    handleLabeledUpdate() {
        console.log("updated labeled: ");
        var view = {...this.state.view};
        view.labels.labeled = !view.labels.labeled;
        this.setState({view});
        this.getView(view);
    }

    upload() {
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
        }).then(() => this.getView(this.state.view))
        .catch(console.log)
    }

    getView(view) {
        if(!view.split.train) {
            delete view.split.train;
        }
        if(!view.split.test) {
            delete view.split.test;
        }

        fetch('http://localhost:5000/peoples_speech/get_view',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ view : view }) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.handleImagesUpdate(data);
        })
        .catch(console.log)
    }

    render() {
        return <div>
                <Grid container justifyContent = "center">
                    <TextField id="jsonlines-path" label="Dataset jsonlines path" variant="outlined" value={this.state.jsonlines_path} onChange={this.handlePathUpdate} />
                    <Button id="upload" variant="contained" onClick={ () =>
                        {
                            this.upload();
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
                      <FormControlLabel control={<Checkbox />} onClick={this.handleTrainUpdate} label="Train" />
                      <FormControlLabel control={<Checkbox />} onClick={this.handleTestUpdate} label="Test" />
                      <FormControlLabel control={<Checkbox defaultChecked />} onClick={this.handleLabeledUpdate} label="Labeled" />
                    </FormGroup>
                </Grid>
                <br />
                <Grid container justifyContent = "center">
                    <ImageList sx={{ width: 1000, height: 450 }} cols={6} rowHeight={164}>
                      {this.state.images.map((item) => (
                        <ImageListItem key={item.img}>
                          <img
                            src={`${item.img}`}
                            srcSet={`${item.img}`}
                            alt={item.title}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                </Grid>
            </div>;
    }
}

