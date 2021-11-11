
import React from 'react';
import { Paper, TextField, Grid } from '@material-ui/core';
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
            utterances : {}
        }
        this.handleUtteranceUpdate = this.handleUtteranceUpdate.bind(this);
        this.handleLabelUpdate = this.handleLabelUpdate.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

    handleUtteranceUpdate(utterances) {
        console.log("updated utterances: " + utterances);
        let dictionary = utterances["utterances"].reduce((a,x) => ({...a, [x.uid]: x}), {})

        this.setState({utterances: dictionary});
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

    handleLabelUpdate(uid, label) {
        console.log("updated utterance labels: " + label.target.value);
        let utterances = {...this.state.utterances};
        utterances[uid].label = label.target.value;
        this.setState({utterances: utterances});
    }

    keyPress(uid, e){
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
                     images : [ {selected: true, uid: uid} ],
                     label : this.state.utterances[uid].label}) // body data type must match "Content-Type" header
             }
         )
         .then(res => res.json())
         .then((data) => {
             console.log("Got response: ", data);
             this.refresh();
         }).catch(console.log)
      }
   }

    render() {
        return <div>

                <Grid container spacing={2} columns={32}>
                  {Object.keys(this.state.utterances).map((uid, index) => (
                    <>
                    <Grid item xs={28}>
                        <Item>
                            <TextField id={uid} label={this.state.utterances[uid].speaker}
                                variant="outlined" value={this.state.utterances[uid].label}
                                style = {{width: 500}}
                                onKeyDown={(e) => {
                                    this.keyPress(uid, e);
                                }}
                                onChange = {(label) => {
                                    this.handleLabelUpdate(uid, label);
                                }} />

                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                      <Item>
                          <AudioButton url={this.state.utterances[uid].audio} />
                      </Item>
                    </Grid>
                    </>
                ))}
              </Grid>
            </div>;
    }
}


