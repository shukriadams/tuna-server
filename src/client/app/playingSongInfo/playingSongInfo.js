/**
 *  Renders the artist and title of the currently playing song.
 */

import React from 'react'
import { connect } from 'react-redux'
import queueHelper from './../queue/queueHelper'

class View extends React.Component {

    render(){
        return(
            <div className="playingSongInfo">
                <div className="playingSongInfo-artist">{this.props.artist}</div>
                <div className="playingSongInfo-title">{this.props.song}</div>
            </div>
        )
    }
}

export default connect(
    function () {
        let playing = queueHelper.getCurrentSong() || {}

        return {
            artist : playing.artist,
            song: playing.name
        }
    }
)(View)