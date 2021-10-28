
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

export default class ErrorAnalysisDialog extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            images: [ ],
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen() {
        this.setState({open : true});
        this.getResults();
    }

    handleClose() {
        this.setState({open : false});
    }

    handleImagesUpdate(data) {
        let new_images = data["images"].map((image) => ({
            img: image["url"],
            audio_url: image["audio_url"],
            label: image["label"],
            prediction: image["prediction"],
            uid: image["uid"]}));
        this.setState({images: new_images});
    }

    getResults() {

        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_error_analysis_results',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ model_uid : this.props.uid }) // body data type must match "Content-Type" header
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
        return (
        <div>
            <Button variant="contained" onClick={this.handleClickOpen}>
                Error Analysis
            </Button>
            <Dialog open={this.state.open} onClose={this.props.handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Error Analysis</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Review the errors made by the model.
                    </DialogContentText>
                        {this.state.images.map((item) => (
                            <div>
                            <Card outlined={true} sx={{ maxWidth: 540 }}>
                                <CardMedia
                                    component="img"
                                    width="540"
                                    image={item.img}
                                    alt={item.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                       {item.uid}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Label: <q>{item.label}</q>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Prediction: <q>{item.prediction}</q>
                                    </Typography>
                                </CardContent>
                            </Card>
                            <br />
                            </div>

                          ))}

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}



