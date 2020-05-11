/**
 * Renders a timer showing the playtime of the currently playing song.
 * Renders nothing if no song playing.
 * Clicking the timer flips the timer between from-start and to-end.
 */

import React from 'react'
import timebelt from 'timebelt'
import { connect } from 'react-redux'

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            currentTimeCountUp : true,
            show : true
        }
    }

    changeTimeDirection(){
        this.setState({ currentTimeCountUp : !this.state.currentTimeCountUp}) 
    }

    render(){
        let time = this.props.time || 0

        time = this.state.currentTimeCountUp ?
            timebelt.secondsToMinutesString(time) :
            timebelt.secondsToMinutesString(this.props.duration - time)

        return(
            <div className="playingTimer">
                <div className="playingTimer-time" onClick={this.changeTimeDirection.bind(this)}>{time}</div>
            </div>
        )
    }
}

export default connect(
    (state)=>{
        let playing = state.playing || { time: 0, duration: 0 } // force defaults so as not to break calculation logic

        return {
            time: playing.time,
            duration : playing.duration
        }
    }
)(View)