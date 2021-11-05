
import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Slider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

import ThresholdChart from './ThresholdChart'

export default class MetricsDialog extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            concepts : [],
            confusionMatrix: {},
            threshold : 0.3,
            audios: [],
            open : false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleThresholdChange = this.handleThresholdChange.bind(this);
    }

    handleClickOpen() {
        this.setState({open : true});
        this.getResults();
    }

    handleClose() {
        this.setState({open : false});
    }

    handleThresholdChange(event, value) {
        this.setState({threshold : value});

        this.handleConfusionMatrixUpdate(this.state.audios);
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
            console.log("Got error analysis response: ", data);
            this.handleAudiosUpdate(data);
        })
        .catch(console.log)
    }

    handleAudiosUpdate(data) {
        let audios = data["audios"].map((audio) => ({
            label: audio["label"],
            prediction: audio["prediction"],
            targetConcept: audio["target_concept"],
            score: audio["score"],
            uid: audio["uid"]}));

        this.setState({audios : audios});

        this.handleConfusionMatrixUpdate(this.state.audios);
    }

    handleConfusionMatrixUpdate(audios) {

        let concept_set = new Set(audios.map((audio) => (audio.label)));
        let concepts = [...concept_set];

        let confusionMatrix = makeConfusionMatrix(audios, this.state.threshold, concepts);

        this.setState({concepts: concepts, confusionMatrix : confusionMatrix});
    }

    render() {
        return (
        <div>
            <Button variant="contained" onClick={this.handleClickOpen}>
                Metrics
            </Button>
            <Dialog open={this.state.open} onClose={this.props.handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Metrics</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Review metrics and adjust the threshold.
                    </DialogContentText>

                    { /* Confusion Matrix */ }
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 300 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell> Label / Prediction </TableCell>
                                    {this.state.concepts.map((concept) => (
                                        <TableCell key={concept} align="right">{concept}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.concepts.map((concept1) => (
                                    <TableRow
                                        key={concept1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row"> {concept1} </TableCell>
                                            {this.state.concepts.map((concept2) => (
                                                <TableCell key={concept1+concept2} align="right">{this.state.confusionMatrix[concept1][concept2]}</TableCell>
                                            ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>


                    { /* Threshold Slider */ }
                    <Box sx={{ width: 300 }}>
                        <Slider
                            aria-label="Always visible"
                            defaultValue={0.3}
                            getAriaValueText={valuetext}
                            step={0.01}
                            marks={marks}
                            min={0.0}
                            max={1.0}
                            valueLabelDisplay="on"
                            onChange={this.handleThresholdChange}
                        />
                    </Box>

                    { /* Chart */ }
                    <ThresholdChart threshold={this.state.threshold} audios={this.state.audios} concepts={this.state.concepts} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

function valuetext(value) {
  return `${value}`;
}

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: .20,
    label: '0.2',
  },
  {
    value: .37,
    label: '0.37',
  },
  {
    value: 1.0,
    label: '1.00',
  },
];

function makeConfusionMatrix(audios, threshold, concepts) {
    let confusionMatrix = {}

    for (const concept of concepts) {
        let row = {}
        for (const concept2 of concepts) {
            row[concept2] = 0;
        }
        confusionMatrix[concept] = row;
    }

    for (const audio of audios) {
        let label = audio.label;
        var prediction = audio.targetConcept;
        let score = audio.score;

        if (score < threshold) {
            prediction = "none";
        }

        confusionMatrix[label][prediction]++;
    }

    return confusionMatrix;
}

