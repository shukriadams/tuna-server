/**
 * Container control for all player info controls. Responsible mainly for width behaviour. Keep the logic
 * for each specific player info locked into subcontrols,
 */
import React from 'react'
import { connect } from 'react-redux'
import PlayerControls from './../playerControls/playerControls'
import ProgressBar from './../progressBar/progressBar'
import PlayingTimer from './../playingTimer/playingTimer'
import PlayingSongInfo from './../playingSongInfo/playingSongInfo'
import ClassNames from 'classnames'

class View extends React.Component {
    render(){
        let noSongsInQueue = this.props.queue.songs.length === 0

        return(
            <div className={ClassNames('playingStrip', {'playingStrip--minimal' : !this.props.playstripFullSize, 'playingStrip--noSong' : noSongsInQueue})}>
                <div className="playingStrip-gridScaffold">
                    {/* used to scaffold when rendering in mini mode */}
                    <div className="playingStrip-miniScaffold">
                        <div className="playingStrip-info">
                            <PlayingSongInfo />
                        </div>
                        <div className="playingStrip-timer">
                            <PlayingTimer />
                        </div>
                        <div className="playingStrip-progress">
                            <ProgressBar/>
                        </div>
                        <div className="playingStrip-controls">
                            <PlayerControls />
                        </div>
                    </div>
               </div>
            </div>
        )
    }
}

export default connect(
    (state)=>{
        return {
            queue : state.queue,
            playstripFullSize : state.now.playstripFullSize
        }
    }
)(View)
