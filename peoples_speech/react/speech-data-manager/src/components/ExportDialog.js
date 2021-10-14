
import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@material-ui/core';

export default class ExportDialog extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            name : "",
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleNameUpdate = this.handleNameUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleNameUpdate(name) {
        console.log("updated name: " + name.target.value);
        this.setState({name: name.target.value});
    }

    handleClickOpen() {
        this.setState({open : true});
    }

    handleClose() {
        this.setState({open : false});
    }

    handleSave() {
        this.setState({open : false});

        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/export',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ view : this.props.view, images: this.props.images, name: this.state.name}) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
        })
        .catch(console.log)
    }

    render() {
        return (
        <div>
            <Button variant="contained" onClick={this.handleClickOpen}>
                Export Selected
            </Button>
            <Dialog open={this.state.open} onClose={this.props.handleClose}>
                <DialogTitle>Export</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Provide a name for the exported dataset.
                    </DialogContentText>
                    <TextField
                        value={this.state.name}
                        onChange={this.handleNameUpdate}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Exported Dataset Name"
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


