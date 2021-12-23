
import React from 'react';

import { Button, Slider } from '@material-ui/core';

export default class AudioRangePlayer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            play: false,
            sequence: this.props.sequence,
            startTime : this.props.startTime,
            currentTime: this.props.startTime,
            endTime : this.props.endTime,
            startTimeLimit : Math.max(this.props.startTime - 5, 0),
            endTimeLimit : this.props.endTime + 5
        }

        this.audio = new Audio(this.props.url);
        this.audio.currentTime = this.state.startTime;

        this.timeUpdate = this.timeUpdate.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSliderClick = this.handleSliderClick.bind(this);
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.setState({ play: false }));
        this.audio.addEventListener('timeupdate', this.timeUpdate);
    }

    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.setState({ play: false }));
        this.audio.removeEventListener('timeupdate', this.timeUpdate);
    }

    togglePlay = () => {
        this.setState({ play: !this.state.play }, () => {
            if (this.state.play) {
                this.audio.currentTime = this.state.startTime
                this.audio.play();
            }
            else {
                this.audio.pause();
            }
        });
    }

    timeUpdate() {
        this.setState({ currentTime: this.audio.currentTime });
        if (this.state.play) {
            if (this.audio.currentTime > this.state.endTime) {
                this.togglePlay();
            }
        }
    }

    handleSliderChange(event, newValue) {
        this.setState({
            startTime: newValue[0],
            endTime: newValue[1]
        });

        this.props.setStartTime(newValue[0]);
        this.props.setEndTime(newValue[1]);
    }

    handleSliderClick(event, newValue) {
        if (newValue[1] === this.state.endTimeLimit) {
            this.setState({
                endTimeLimit : this.state.endTimeLimit + 5
            });
        }
        if (newValue[1] === this.state.startTimeLimit) {
            this.setState({
                startTimeLimit : Math.max(this.state.startTimeLimit - 5, 0)
            });
        }
    }

    // TODO: remove this hack by putting the state in transcription tool
    refresh() {
        if (this.state.sequence === this.props.sequence) {
            return;
        }

        this.setState({
            sequence: this.props.sequence,
            startTime : this.props.startTime,
            currentTime: this.props.startTime,
            endTime : this.props.endTime,
            startTimeLimit : Math.max(this.props.startTime - 5, 0),
            endTimeLimit : this.props.endTime + 5
        });
    }

    render() {
        this.refresh();

        return (
            <div>
                <Button variant="contained" onClick={this.togglePlay}> {this.state.play ? 'Pause' : 'Play'} </Button>
                {round2(this.state.currentTime)}
                <Slider
                    size="small"
                    step={0.25}
                    getAriaLabel={() => 'Time range'}
                    value={[this.state.startTime, this.state.endTime]}
                    onChange={this.handleSliderChange}
                    valueLabelDisplay="auto"
                    min={this.state.startTimeLimit}
                    max={this.state.endTimeLimit}
                    marks={[{label: valuetext(this.state.startTimeLimit), value: this.state.startTimeLimit},
                           {label: valuetext(this.state.endTimeLimit), value: this.state.endTimeLimit}]}
                    getAriaValueText={valuetext}
                    onChangeCommitted={this.handleSliderClick}
                  />
            </div>
        );
    }
}

AudioRangePlayer.defaultProps = {
    startTime : 0.0,
    endTime : 0.0
};

function valuetext(value) {
  return `${round2(value)}`;
}

function round2(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
}

