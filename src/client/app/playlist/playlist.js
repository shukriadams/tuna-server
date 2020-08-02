import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import store from './../store/store';
import history from './../history/history'
import { View as Button } from './../glu_button/index'

class View extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('inc props', nextProps)
    }

    render(){
        const songsInPlaylist = [],
            allSongs = store.getState().session.songs

        // handle no playlist found
        if (!this.props.playlist){
            return (
                <div>
                    Playlist not found
                </div>)
        }

        // get array of songs on playlist
        for (const songId of this.props.playlist.songs){
            const song = allSongs.find(song => song.id === songId)
            if (!song)
                continue

                songsInPlaylist.push(song)
        }

        return (
            <div className="playlist">
                <Link to="/playlists">All playlists</Link>
                <div>
                    <h2>{this.props.playlist.name}</h2>

                    {
                        !songsInPlaylist.length &&
                            <div>
                                This in playlist is empty - add some songs to it
                            </div>
                    }

                    {
                        songsInPlaylist.length &&
                        <Fragment>
                            <ul className="playlist">
                                {
                                    songsInPlaylist.map((song, index) => (
                                        <li className="playlist-listItem" key={index}>
                                            <div className="playlist-listItemContent">
                                                {song.name}
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>

                            <div className="playlist-functions">
                                <Button text="Add to queue"></Button>
                                <Button text="Make queue"></Button>
                            </div>

                        </Fragment>
                    }

                </div>

            </div>
        )
    }
}

export default connect(
    (state, props)=>{
        return {
            playlist : state.session.playlists.find(playlist => playlist.id === props.id) 
        }
    }
)(View)

