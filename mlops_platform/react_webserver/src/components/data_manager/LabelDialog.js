

import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@material-ui/core';

export default class LabelDialog extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            label : "",
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleLabelUpdate = this.handleLabelUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleLabelUpdate(label) {
        console.log("updated label: " + label.target.value);
        this.setState({label: label.target.value});
    }

    handleClickOpen() {
        this.setState({open : true});
    }

    handleClose() {
        this.setState({open : false});
    }

    handleSave() {
        this.setState({open : false});
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/set_labels',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    view : this.props.view,
                    images : this.props.images,
                    label : { label: this.state.label, utterances: [] }}) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.props.getView(this.props.view);
        }).catch(console.log)
    }

    render() {
        return (
        <div>
            <Button variant="contained" onClick={this.handleClickOpen}>
                Label
            </Button>
            <Dialog open={this.state.open} onClose={this.props.handleClose}>
                <DialogTitle>Labeling Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Provide a transcription for the audio.
                    </DialogContentText>
                    <TextField
                        value={this.state.label}
                        onChange={this.handleLabelUpdate}
                        autoFocus
                        margin="dense"
                        id="label"
                        label="Audio Label"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button onClick={this.handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

