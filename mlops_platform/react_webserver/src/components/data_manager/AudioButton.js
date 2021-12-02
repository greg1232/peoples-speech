
import React from 'react';

import { Button } from '@material-ui/core';

export default class AudioButton extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            play: false,
            currentTime: this.props.startTime
        }

        this.audio = new Audio(this.props.url)
        this.audio.currentTime = this.props.startTime

        this.timeUpdate = this.timeUpdate.bind(this);
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
                this.audio.currentTime = this.props.startTime
                this.audio.play();
            }
            else {
                this.audio.pause();
            }
        });
    }

    timeUpdate() {
        this.setState({ currentTime: this.audio.currentTime });
    }

    render() {
        return (
        <div>
            <Button variant="contained" onClick={this.togglePlay}> {this.state.play ? 'Pause' : 'Play'} </Button>
            {Math.floor(this.state.currentTime)}
        </div>
        );
    }
}

AudioButton.defaultProps = {
    startTime : 0.0
};

