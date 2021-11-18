
import React from 'react';

import { Button } from '@material-ui/core';

export default class AudioButton extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            play: false
        }

        this.audio = new Audio(this.props.url)
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.setState({ play: false }));
    }

    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.setState({ play: false }));
    }

    togglePlay = () => {
        this.setState({ play: !this.state.play }, () => {
            this.state.play ? this.audio.play() : this.audio.pause();
        });
    }

    render() {
        return (
        <div>
            <Button variant="contained" onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</Button>
        </div>
        );
    }
}

