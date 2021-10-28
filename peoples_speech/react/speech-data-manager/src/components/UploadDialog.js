
import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@material-ui/core';

export default class UploadDialog extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            label : "",
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen() {
        this.setState({open : true});
    }

    handleClose() {
        this.setState({open : false});
    }

    render() {
        return (
        <div>
        </div>
        );
    }
}

