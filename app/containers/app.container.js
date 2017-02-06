import React from 'react';

import Axios from 'axios';
import Sound from  'react-sound';

import Search from '../components/search.component';
import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Footer from '../components/footer.component';

class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        this.client_id = '2f98992c40b8edf17423d93bda2e04ab';
        this.state = {
            track: {
                stream_url: '',
                title: '',
                artwork_url: ''
            },
            playStatus: Sound.status.STOPPED,
            playFromPosition: 0,
            elapsed: '00:00:00',
            total: '00:00:00',
            position: 0,
            autoCompleteValue: '',
            tracks: []
        };
    }

    render() {
        const style = {
            width: '500px',
            height: '500px',
            backgroundImage: `linear-gradient(
            rgba(0,0,0,0.7),
            rgba(0,0,0,0.7)
            ), url(${this.xlArtwork(this.state.track.artwork_url)})`
        };
        return (
            <div className="music" style={style}>
                <Search
                    autoCompleteValue={this.state.autoCompleteValue}
                    tracks={this.state.tracks}
                    handleSelect={this.handleSelect.bind(this)}
                    handleChange={this.handleChange.bind(this)}
                />
                <Details
                    title={this.state.track.title}
                />
                <Player
                    togglePlay={this.togglePlay.bind(this)}
                    stop={this.stop.bind(this)}
                    forward={this.forward.bind(this)}
                    backward={this.backward.bind(this)}
                    random={this.randomTrack.bind(this)}
                    playStatus={this.state.playStatus}
                />
                <Progress
                    elapsed={this.state.elapsed}
                    total={this.state.total}
                    position={this.state.position}
                />
                <Footer/>
                <Sound
                    url={this.prepareUrl(this.state.track.stream_url)}
                    playStatus={this.state.playStatus}
                    onPlaying={this.handleSongPlaying.bind(this)}
                    playFromPosition={this.state.playFromPosition}
                    onFinishedPlaying={this.handleSongFinished.bind(this)}
                />
            </div>
        );
    }

    xlArtwork(url) {
        return url.replace(/large/, 't500x500');
    }

    togglePlay() {
        this.setState({
            playStatus: this.state.playStatus === Sound.status.PLAYING ? Sound.status.PAUSED : Sound.status.PLAYING
        });
    }


    stop() {
        this.setState({
            playStatus: Sound.status.STOPPED
        });
    }


    forward() {
        this.setState({
            playFromPosition: this.state.playFromPosition += 10000
        });
    }


    backward() {
        this.setState({
            playFromPosition: this.state.playFromPosition -= 10000
        });
    }

    handleSelect(value, item) {
        this.setState({
            autoCompleteValue: value,
            track: item
        });

    }


    handleChange(event, value) {
        this.setState({
            autoCompleteValue: event.target.value
        });
        Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
            .then((response) => {
                this.setState({
                    tracks: response.data
                });
            })
            .catch(console.error);
    }


    prepareUrl(url) {
        return `${url}?client_id=${this.client_id}`;
    }

    handleSongPlaying(audio) {

        this.setState({
            elapsed: this.formatMillseconds(audio.position),
            total: this.formatMillseconds(audio.duration),
            position: audio.position / audio.duration
        })
    }

    formatMillseconds(millseconds) {
        let hours = Math.floor(millseconds / 3600000);
        millseconds = millseconds % 3600000;
        let minutes = Math.floor(millseconds / 60000);
        millseconds = millseconds % 60000;
        let seconds = Math.floor(millseconds / 1000);
        return `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    }

    formatTime(time) {
        return (time < 10 ? '0' : '') + time;
    }

    handleSongFinished() {
        this.randomTrack();
    }


    componentDidMount() {
        this.randomTrack();
    }

    randomTrack() {
        Axios.get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
            .then((response) => {

                const trackLength = response.data.tracks.length;
                const randomNumber = Math.floor((Math.random() * trackLength) + 1);
                console.log(response);
                this.setState({
                    track: response.data.tracks[randomNumber]
                });
            })
            .catch(console.error);

    }
}

export default AppContainer;