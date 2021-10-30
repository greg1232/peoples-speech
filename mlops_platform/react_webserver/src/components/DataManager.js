
import React from 'react';
import { Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox, Button, Box, ImageListItemBar } from '@material-ui/core';
import UploadDialog from './UploadDialog'
import LabelDialog from './LabelDialog'
import ExportDialog from './ExportDialog'
import AudioButton from './AudioButton'

export default class DataManager extends React.Component {
    constructor(props){
        super(props)
        this.state = {
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
        this.handleImagesUpdate = this.handleImagesUpdate.bind(this);
        this.handleTrainUpdate = this.handleTrainUpdate.bind(this);
        this.handleTestUpdate = this.handleTestUpdate.bind(this);
        this.handleLabeledUpdate = this.handleLabeledUpdate.bind(this);
        this.handleImageClick= this.handleImageClick.bind(this);
        this.getView = this.getView.bind(this);
    }

    handleImageClick(item) {
        if (item.selected === 1) {
            item.selected = 0;
        }
        else {
            item.selected = 1;
        }
        this.setState({images: this.state.images});
    }

    handleImagesUpdate(data) {
        let new_images = data["images"].map((image) => ({
            label: image["label"],
            img: image["url"],
            audio : image["audio_url"],
            uid: image["uid"],
            title: "uploaded",
            selected: 0}));
        this.setState({images: new_images});
    }

    handleTrainUpdate() {
        console.log("updated train: ");
        var view = {...this.state.view};
        view.split.train = !view.split.train;
        this.setState({view});
        this.getView();
    }

    handleTestUpdate() {
        console.log("updated test: ");
        var view = {...this.state.view};
        view.split.test = !view.split.test;
        this.setState({view});
        this.getView();
    }

    handleLabeledUpdate() {
        console.log("updated labeled: ");
        var view = {...this.state.view};
        view.labels.labeled = !view.labels.labeled;
        this.setState({view});
        this.getView();
    }

    getView() {
        if(!this.state.view.split.train) {
            delete this.state.view.split.train;
        }
        if(!this.state.view.split.test) {
            delete this.state.view.split.test;
        }

        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_view',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ view : this.state.view }) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.handleImagesUpdate(data);
        })
        .catch(console.log)
    }

    componentDidMount() {
        this.getView();
    }

    render() {
        return <div>
                <Grid container justifyContent = "center">
                    <UploadDialog getView={this.getView} />
                </Grid>
                <Grid container justifyContent = "center">
                    <Box m={1}>
                        <LabelDialog images={this.state.images} view={this.state.view} getView={this.getView} />
                    </Box>
                    <Box m={1}>
                        <Button id="autosplit" variant="contained" onClick={() =>
                            {
                                fetch(process.env.REACT_APP_API_URL + '/peoples_speech/autosplit',
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
                    </Box>
                    <Box m={1}>
                        <ExportDialog images={this.state.images} view={this.state.view} />
                    </Box>
                </Grid>
                <Grid container justifyContent = "center">
                    <FormGroup row={true}>
                      <FormControlLabel control={<Checkbox onClick={this.handleTrainUpdate} />} label="Train" />
                      <FormControlLabel control={<Checkbox onClick={this.handleTestUpdate} />} label="Test" />
                      <FormControlLabel control={<Checkbox onClick={this.handleLabeledUpdate} defaultChecked />} label="Labeled" />
                    </FormGroup>
                </Grid>
                <br />
                <Grid container justifyContent = "center">
                    <ImageList sx={{ width: 1000, height: 450 }} cols={6} rowHeight={164}>
                      {this.state.images.map((item) => (
                        <ImageListItem key={item.img} sx={{ border: item.selected }} onClick={() => this.handleImageClick(item)}>
                            <img
                                src={`${item.img}`}
                                srcSet={`${item.img}`}
                                alt={item.title}
                            />
                            <ImageListItemBar
                                title={item.label}
                                actionIcon={
                                    <AudioButton url={`${item.audio}`} />
                                }
                            />
                        </ImageListItem>
                      ))}
                    </ImageList>
                </Grid>
            </div>;
    }
}




