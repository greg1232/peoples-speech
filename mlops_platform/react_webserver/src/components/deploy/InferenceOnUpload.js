
import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Paper, Box, Backdrop, CircularProgress, Grid, Typography } from '@material-ui/core';

import Dropzone from 'react-dropzone'

export default class InferenceOnUpload extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            files : [],
            label: "",
            tags: "",
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateLabel = this.updateLabel.bind(this);
    }

    handleClickOpen() {
        this.setState({open : true});
    }

    handleClose() {
        this.setState({open : false});
    }

    handleSubmit() {
        this.setState({open : false});
    }

    updateLabel(label, tags) {
        this.setState({ label : label, tags: tags });
    }

    render() {

        return (
        <div>
            <Box m={1}>
                <Button variant="contained" onClick={this.handleClickOpen}>
                    Upload
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Upload audio files</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Drag audio files to upload them.
                        </DialogContentText>
                        <DropzoneUploadBox setLabel={this.updateLabel} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box m={1}>
                <Grid container spacing={2} columns={12} sx={{ minWidth: 700, maxWidth: 800 }}>
                    <Grid item xs={12}>
                        <Paper variant="outlined">
                            <Typography variant="h4" component="div" gutterBottom>
                                Label
                            </Typography>
                            {this.state.label}
                        </Paper>
                        <Paper variant="outlined">
                            <Typography variant="h4" component="div" gutterBottom>
                                Tags
                            </Typography>
                            {this.state.tags}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
        );
    }
}

class DropzoneUploadBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files : [],
            isUploading : false
        }

        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.upload = this.upload.bind(this);
        this.predict = this.predict.bind(this);
        this.uploadingFinished = this.uploadingFinished.bind(this);
    }

    handleOnDrop(acceptedFiles) {
        console.log(acceptedFiles);
        this.setState({files: acceptedFiles, isUploading : true});

        for (const file of acceptedFiles) {
            fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_upload_url_for_file',
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({ file : file }) // body data type must match "Content-Type" header
                }
            )
            .then(res => res.json())
            .then((data) => {
                console.log("Got response: ", data);

                this.upload(file, data["url"], data["path"]);
            })
            .catch(console.log)
        }
    }

    upload(file, url, path) {
        fetch(process.env.REACT_APP_DEPLOY_API_URL + '/peoples_speech/register_uploaded_audio',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path : path }) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.predict(path);
        }).catch(console.log)
    }

    predict(path) {
        fetch(process.env.REACT_APP_DEPLOY_API_URL + '/peoples_speech/predict',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path : path }) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.props.setLabel(data["label"], data["tags"]);
            this.uploadingFinished();
        }).catch(console.log)
    }

    uploadingFinished() {
        this.setState({isUploading : false});
    }

    render() {
        const files = this.state.files.map(file => (
            <li key={file.name}>
                {file.name} - {file.size} bytes
            </li>
        ));

        return (<div>
            <Dropzone onDrop={this.handleOnDrop}>
                {({getRootProps, getInputProps}) => (
                    <section className="container">
                        <Paper variant="outlined">
                            <div {...getRootProps({className: 'dropzone'})} style={{ width: 400, height: 200 }}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={this.state.isUploading}
                                onClick={this.uploadingFinished}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </Paper>
                        <aside>
                            <h4>Files</h4>
                            <ul>{files}</ul>
                        </aside>
                  </section>
                )}
            </Dropzone>
        </div>
        );
    }

}

