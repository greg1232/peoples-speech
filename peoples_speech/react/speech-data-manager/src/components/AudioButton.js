
import React from 'react';

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
            <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button>
        </div>
        );
    }
}

