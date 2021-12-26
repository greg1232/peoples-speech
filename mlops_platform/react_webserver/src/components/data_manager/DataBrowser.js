
import React from 'react';
import { Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox,
         Button, Box, ImageListItemBar } from '@material-ui/core';
import UploadDialog from './UploadDialog'
import LabelDialog from './LabelDialog'
import ExportDialog from './ExportDialog'
import AudioButton from './AudioButton'
import EditMenu from './EditMenu'

export default class DataBrowser extends React.Component {
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
            train: image["train"],
            test: image["test"],
            audio : image["audio_url"],
            uid: image["uid"],
            title: "uploaded",
            selected: 0}));
        this.setState({images: new_images});
    }

    handleTrainUpdate() {
        console.log("updated train: ");
        let view = {...this.state.view};
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
                    <Box m={1}>
                        <Button id="transcribe" variant="contained" onClick={() =>
                            {
                                fetch(process.env.REACT_APP_API_URL + '/peoples_speech/make_transcription_task',
                                    {
                                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                        headers: {
                                          'Content-Type': 'application/json'
                                          // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        body: JSON.stringify({ view : this.state.view, images : this.state.images}) // body data type must match "Content-Type" header
                                    }
                                )
                                .then(res => res.json())
                                .then((data) => {
                                    console.log("Got response: ", data);
                                    this.props.switchToTasks();
                                })
                                .catch(console.log)
                            }}>
                            Transcribe
                        </Button>
                    </Box>
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
                                        body: JSON.stringify({ view : this.state.view, images : this.state.images}) // body data type must match "Content-Type" header
                                    }
                                )
                                .then(res => res.json())
                                .then((data) => {
                                    console.log("Got response: ", data);
                                    this.getView();
                                })
                                .catch(console.log)
                            }}>
                            AutoSplit
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button id="set-train" variant="contained" onClick={() =>
                            {
                                fetch(process.env.REACT_APP_API_URL + '/peoples_speech/setsplit',
                                    {
                                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                        headers: {
                                          'Content-Type': 'application/json'
                                          // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        body: JSON.stringify({ view : this.state.view, images : this.state.images, type: "train" }) // body data type must match "Content-Type" header

                                    }
                                )
                                .then(res => res.json())
                                .then((data) => {
                                    console.log("Got response: ", data);
                                    this.getView();
                                })
                                .catch(console.log)
                            }}>
                            Set Train
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button id="set-test" variant="contained" onClick={() =>
                            {
                                fetch(process.env.REACT_APP_API_URL + '/peoples_speech/setsplit',
                                    {
                                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                        headers: {
                                          'Content-Type': 'application/json'
                                          // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        body: JSON.stringify({ view : this.state.view, images : this.state.images, type: "test" }) // body data type must match "Content-Type" header
                                    }
                                )
                                .then(res => res.json())
                                .then((data) => {
                                    console.log("Got response: ", data);
                                    this.getView();
                                })
                                .catch(console.log)
                            }}>
                            Set Test

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
                            <ImageListItemBar
                                sx={{
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                }}
                                title={getTrainTestString(item)}
                                position="top"
                                actionIcon={
                                    <EditMenu uid={item.uid} />
                                }
                                actionPosition="left"
                            />
                        </ImageListItem>
                      ))}
                    </ImageList>
                </Grid>
            </div>;
    }
}

function getTrainTestString(item) {
    if (item.train) {
        return "train";
    }
    if (item.test) {
        return "test";
    }
    return "unsplit";
}





