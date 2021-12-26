
import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Paper, Box, Tab, Grid, TextField } from '@material-ui/core';

import {TabContext, TabList, TabPanel} from '@material-ui/lab';
import Dropzone from 'react-dropzone'
import md5 from 'crypto-js/md5';


export default class UploadDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            files : [],
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                        <UploadTabs getView={this.props.getView} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
        );
    }
}


function UploadTabs(props) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Upload Dataset" value="1" />
            <Tab label="Upload Files" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1"> <DatasetUploadBox getView={props.getView} /> </TabPanel>
        <TabPanel value="2"> <DropzoneUploadBox /> </TabPanel>
      </TabContext>
    </Box>
  );
}

class DatasetUploadBox extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            jsonlines_path : "s3://peoples-speech/examples/prestamo/prestamo.jsonlines"
        }
        this.handlePathUpdate = this.handlePathUpdate.bind(this);
    }

    handlePathUpdate(path) {
        console.log("updated path: " + path.target.value);
        this.setState({jsonlines_path: path.target.value});
    }

    upload() {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/upload',
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
        }).then(() => this.props.getView(this.state.view))
        .catch(console.log)
    }

    render() {
        return (<Grid container justifyContent = "center">
            <TextField id="jsonlines-path" label="Dataset jsonlines path"
                variant="outlined" value={this.state.jsonlines_path}
                onChange={this.handlePathUpdate}
                style = {{width: 500}} />
            <Box m={1}>
                <Button id="upload" variant="contained" onClick={ () =>
                    {
                        this.upload();
                    }}>
                    Upload
                </Button>
            </Box>
        </Grid>
        );

    }
}

class DropzoneUploadBox extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            files : []
        }

        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.registerFile = this.registerFile.bind(this);
        this.upload = this.upload.bind(this);
    }

    handleOnDrop(acceptedFiles) {
        console.log(acceptedFiles);
        this.setState({files: acceptedFiles});

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

                this.upload(file, data["url"], data["path"], data["md5_hash"]);
            })
            .catch(console.log)
        }
    }

    upload(file, url, path, md5Hash) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var binary = event.target.result;
            var localMd5Hash = md5(binary).toString();

            console.log("For file: ", file);
            console.log("Local md5: ", localMd5Hash);
            console.log("Remote md5: ", md5Hash);

            if (md5Hash === localMd5Hash) {
                this.registerFile(path);
            }
            else {
                fetch(url,
                    {
                        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                        body: file
                    }
                )
                .then((data) => {
                    console.log("Got response: ", data);
                    this.registerFile(path);
                }).catch(console.log)

            }
        }.bind(this);

        reader.readAsBinaryString(file);
    }

    registerFile(path) {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/register_uploaded_audio',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path : path }) // body data type must match "Content-Type" header
            }
        )
        .then((data) => {
            console.log("Got response: ", data);
        }).catch(console.log)
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
