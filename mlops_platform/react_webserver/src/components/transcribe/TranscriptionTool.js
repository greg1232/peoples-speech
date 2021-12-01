
import React from 'react';
import { Paper, TextField, Grid, Button, Box } from '@material-ui/core';
import { styled } from '@material-ui/core';

import AudioButton from '../data_manager/AudioButton'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default class TranscriptionTool extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            utterances : []
        }
        this.handleUtteranceUpdate = this.handleUtteranceUpdate.bind(this);
        this.handleLabelUpdate = this.handleLabelUpdate.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

    handleUtteranceUpdate(response) {
        console.log("updated utterances: " + response);

        for (const [index, utterance] of response["utterances"].entries()) {
            utterance.index = index;
        }

        this.setState({utterances: response["utterances"]});
    }

    refresh() {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/get_transcription_utterances',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid : this.props.uid })
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got get_transcription_utterances response: ", data);
            this.handleUtteranceUpdate(data);
        })
        .catch(console.log)
    }

    componentDidMount() {
        this.refresh();
    }

    handleLabelUpdate(utterance, label) {
        console.log("updated utterance labels: " + label.target.value);
        let utterances = [...this.state.utterances];
        utterances[utterance.index].label = label.target.value;
        this.setState({utterances: utterances});
    }

    keyPress(utterance, e){
        if(e.keyCode === 13){
           console.log('value', e.target.value);
           fetch(process.env.REACT_APP_API_URL + '/peoples_speech/set_labels',
               {
                   method: 'POST', // *GET, POST, PUT, DELETE, etc.
                   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                   headers: {
                     'Content-Type': 'application/json'
                     // 'Content-Type': 'application/x-www-form-urlencoded',
                   },
                   body: JSON.stringify({
                       view : {},
                       images : [ {selected: true, uid: utterance.uid} ],
                       label : utterance.label})
               }
           )
           .then(res => res.json())
           .then((data) => {
               console.log("Got response: ", data);
               this.refresh();
           }).catch(console.log)
        }
    }

    autoLabel() {
        if (this.state.utterances.length === 0) {
            return;
        }

        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/auto_label',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    view : {},
                    images : [ {selected: true, uid: this.props.uid} ],
                    label : this.state.utterances[0].label})
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.refresh();
        }).catch(console.log)

    }

    autoSegment() {
        if (this.state.utterances.length === 0) {
            return;
        }

        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/auto_segment',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    view : {},
                    images : [ {selected: true, uid: this.props.uid} ],
                    label : this.state.utterances[0].label})
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.refresh();
        }).catch(console.log)
    }

    render() {
        return <div>
                <Grid container justifyContent = "center">
                    <Box m={1}>
                        <Button id="auto-label" variant="contained" onClick={() =>
                            {
                                console.log("Autolabeling: " + this.props.uid);
                                this.autoLabel();
                            }}>
                            AutoLabel
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button id="auto-split" variant="contained" onClick={() =>
                            {
                                console.log("Autosegmenting: " + this.props.uid);
                                this.autoSegment();
                            }}>
                            AutoSplit
                        </Button>
                    </Box>
                </Grid>
            <Box m={1}>
                <Grid container spacing={2} columns={12} sx={{ minWidth: 700, maxWidth: 800 }}>
                    {this.state.utterances.map((utterance) => (
                        <>
                        <Grid item xs={11}>
                            <Item>
                                <TextField key={"label-" + utterance.index} id={"label-" + utterance.index} label={utterance.speaker}
                                    variant="outlined" value={utterance.label}
                                    multiline
                                    maxRows={Infinity}
                                    style = {{width: "95%"}}
                                    onKeyDown={(e) => {
                                        this.keyPress(utterance, e);
                                    }}
                                    onChange = {(label) => {
                                        this.handleLabelUpdate(utterance, label);
                                    }} />

                            </Item>
                        </Grid>
                        <Grid item xs={1}>
                            <AudioButton
                                url={utterance.audio}
                                startTime={utterance.audio_info.start / 1000.0}
                                endTime={utterance.audio_info.end / 1000.0} />
                        </Grid>
                        </>
                    ))}
                </Grid>
            </Box>
            <Box m={1}>
                <Grid container justifyContent = "center" p={1}>
                    <Button id="make-data" variant="contained" onClick={() =>
                        {
                            console.log("Making data elements: " + this.props.uid);
                        }}>
                        Submit Transcripts
                    </Button>
                </Grid>
            </Box>
        </div>;
    }
}


