
import React from 'react';
import { Paper, TextField, Grid, Button, Box, Pagination } from '@material-ui/core';
import { styled } from '@material-ui/core';

import AudioRangePlayer from './AudioRangePlayer'

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
            utterances : [],
            allUtterances: [],
            page : 0,
            pageCount : 0
        }
        this.handleUtteranceUpdate = this.handleUtteranceUpdate.bind(this);
        this.groupIntoSentences= this.groupIntoSentences.bind(this);
        this.handleLabelUpdate = this.handleLabelUpdate.bind(this);
        this.handleTagUpdate = this.handleTagUpdate.bind(this);
        this.setStartTime= this.setStartTime.bind(this);
        this.setEndTime= this.setEndTime.bind(this);
        this.clearEmpty = this.clearEmpty.bind(this);
        this.saveTranscripts = this.saveTranscripts.bind(this);
        this.splitIntoClips = this.splitIntoClips.bind(this);
        this.refresh = this.refresh.bind(this);
        this.autoLabel = this.autoLabel.bind(this);
        this.autoSegment = this.autoSegment.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handleUtteranceUpdate(response) {

        for (const [index, utterance] of response["utterances"].entries()) {
            utterance.index = index;
            utterance.tag = "";
            utterance.sequence = 0;
        }
        console.log("updated utterances: ", response);

        this.setState({allUtterances: response["utterances"],
            utterances : getUtterancesForPage(response["utterances"], 1),
            pageCount : getPageCount(response["utterances"].length),
            page: 1
        });
    }

    handlePageChange(event, value) {
        let utterances = [...this.state.allUtterances];
        for (const [index, utterance] of utterances.entries()) {
            utterance.index = index;
            utterance.sequence++;
        }
        this.setState({ page: value,
            utterances : getUtterancesForPage(utterances, value),
            allUtterances : utterances
        });
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
        let utterances = [...this.state.allUtterances];
        utterances[utterance.index].utterance_info.label = label.target.value;
        this.setState({allUtterances: utterances,
            utterances : getUtterancesForPage(utterances, this.state.page)
        });
    }

    handleTagUpdate(utterance, tag) {
        console.log("updated utterance labels: " + tag.target.value);
        let utterances = [...this.state.allUtterances];
        utterances[utterance.index].utterance_info.tag = tag.target.value;
        this.setState({allUtterances: utterances,
            utterances : getUtterancesForPage(utterances, this.state.page)
        });
    }

    autoLabel() {
        if (this.state.allUtterances.length === 0) {
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
                    label : this.state.utterances[0].utterance_info.label})
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.refresh();
        }).catch(console.log)

    }

    groupIntoSentences() {
        if (this.state.allUtterances.length === 0) {
            return;
        }

        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/group_into_sentences',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    view : {},
                    images : [ {selected: true, uid: this.props.uid} ]
                })
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.refresh();
        }).catch(console.log)

    }

    autoSegment() {
        if (this.state.allUtterances.length === 0) {
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
                    images : [ {selected: true, uid: this.props.uid} ]
                })
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.refresh();
        }).catch(console.log)
    }

    setStartTime(utterance, startTime) {
        let utterances = [...this.state.allUtterances];
        utterances[utterance.index].utterance_info.audio_info.start = startTime * 1000.0;
        this.setState({allUtterances: utterances});
    }

    setEndTime(utterance, endTime) {
        let utterances = [...this.state.allUtterances];
        utterances[utterance.index].utterance_info.audio_info.end = endTime * 1000.0;
        this.setState({allUtterances: utterances});
    }

    clearEmpty() {
        let filtered = this.state.allUtterances.filter(utterance => utterance.utterance_info.label.length > 0);
        for (const [index, utterance] of filtered.entries()) {
            utterance.index = index;
            utterance.sequence++;
        }
        this.setState({allUtterances: filtered,
        });
    }


    saveTranscripts() {
        let utterances = this.state.allUtterances.map((utterance) => (utterance.utterance_info));
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
                    images : [{ selected: true, uid: this.props.uid }],
                    label : { label: "", utterances: utterances }}) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
        }).catch(console.log)
    }

    splitIntoClips() {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/submit_transcripts',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({utterances : this.state.allUtterances})
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
        }).catch(console.log)
    }

    render() {
        return <div>
            <Grid container justifyContent = "center">
                <Box m={1}>
                    <Button id="auto-label" variant="contained" onClick={this.autoLabel}>
                        AutoLabel
                    </Button>
                </Box>
                <Box m={1}>
                    <Button id="auto-split" variant="contained" onClick={this.groupIntoSentences}>
                        Group Into Sentences
                    </Button>
                </Box>
                <Box m={1}>
                    <Button id="auto-split" variant="contained" onClick={this.autoSegment}>
                        Fix Timestamps
                    </Button>
                </Box>
            </Grid>
            <Box m={1}>
                <Grid container spacing={2} columns={12} sx={{ minWidth: 900, maxWidth: 1000 }}>
                    {this.state.utterances.map((utterance) => (
                        <>
                        <Grid item xs={8}>
                            <Item>
                                <TextField key={"label-" + utterance.index} id={"label-" + utterance.index} label={utterance.utterance_info.speaker}
                                    variant="outlined" value={utterance.utterance_info.label}
                                    multiline
                                    maxRows={Infinity}
                                    style = {{width: "95%"}}
                                    onChange = {(label) => {
                                        this.handleLabelUpdate(utterance, label);
                                    }} />

                            </Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item>
                                <TextField key={"tag-" + utterance.index} id={"tag-" + utterance.index} label={"Tag"}
                                    variant="outlined" value={utterance.utterance_info.tag}
                                    multiline
                                    maxRows={Infinity}
                                    style = {{width: "95%"}}
                                    onChange = {(label) => {
                                        this.handleTagUpdate(utterance, label);
                                    }} />

                            </Item>
                        </Grid>
                        <Grid item xs={2}>
                            <AudioRangePlayer
                                url={utterance.audio_info.audio}
                                sequence={utterance.sequence}
                                duration={utterance.audio_info.duration_ms / 1000.0}
                                startTime={utterance.utterance_info.audio_info.start / 1000.0}
                                endTime={utterance.utterance_info.audio_info.end / 1000.0}
                                setStartTime={(startTime) => { this.setStartTime(utterance, startTime); }}
                                setEndTime={(endTime) => { this.setEndTime(utterance, endTime); }}
                             />
                        </Grid>
                        </>
                    ))}
                </Grid>
                <Pagination count={this.state.pageCount} page={this.state.page} onChange={this.handlePageChange} />
            </Box>
            <Box m={1}>
                <Grid container justifyContent = "center" p={1}>
                    <Box m={1}>
                        <Button id="clean-empty" variant="contained" onClick={this.clearEmpty} >
                            Clear Empty
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button id="split-into-clips" variant="contained" onClick={this.splitIntoClips} >
                            Split Into Clips
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button id="submit-transcripts" variant="contained" onClick={this.saveTranscripts} >
                            Save Transcript
                        </Button>
                    </Box>
                </Grid>
            </Box>
        </div>;
    }
}

function getPageCount(length) {
    return Math.ceil(length / 10).toFixed();
}

function getUtterancesForPage(utterances, page) {
    let start = (page - 1) * 10;
    let end = Math.min(utterances.length, start + 10);

    return utterances.slice(start, end);
}


