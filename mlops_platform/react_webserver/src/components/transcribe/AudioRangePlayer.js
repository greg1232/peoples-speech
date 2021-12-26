
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
            startTimeLimit : padStart(this.props.startTime, this.props.endTime),
            endTimeLimit : padEnd(this.props.startTime, this.props.endTime, this.props.duration)
        }

        this.audio = new Audio(this.props.url);
        this.audio.currentTime = this.state.startTime;

        this.timeUpdate = this.timeUpdate.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSliderClick = this.handleSliderClick.bind(this);
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.setState({ play: false }));
    }

    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.setState({ play: false }));
    }

    togglePlay = () => {
        this.setState({ play: !this.state.play }, () => {
            if (this.state.play) {
                this.audio.currentTime = this.state.startTime
                this.audio.play();
                this.timeUpdate();
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
            } else {
                window.requestAnimationFrame(this.timeUpdate);
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
                endTimeLimit : padEnd(this.state.startTimeLimit, this.state.endTimeLimit, this.props.duration)
            });
        }
        if (newValue[1] === this.state.startTimeLimit) {
            this.setState({
                startTimeLimit : padStart(this.state.startTimeLimit, this.state.endTimeLimit)
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
            startTimeLimit : padStart(this.props.startTime, this.props.endTime),
            endTimeLimit : padEnd(this.props.startTime, this.props.endTime, this.props.duration)
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

function padStart(startTime, endTime) {
    let padding = Math.max(1, (0.2 * (endTime - startTime)).toFixed());

    return Math.max(startTime - padding, 0);
}

function padEnd(startTime, endTime, duration) {
    let padding = Math.max(1, (0.2 * (endTime - startTime)).toFixed());

    return Math.min(endTime + padding, duration);
}

