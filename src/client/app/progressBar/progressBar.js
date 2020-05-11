/**
 * Renders a bar which shows the progress of the currently playing song. Clicking on the bar advances the current song's
 * time to the relative position of the clicked location, as a proportion of bar length.
 *
 */
import React from 'react'
import { connect } from 'react-redux'
import { playJumpToPercent } from './../actions/actions'
import vc from 'vcjs'

class View extends React.Component {

    onProgressBarClick(e){
        const xPos = e.pageX - vc.offset(this.refs.total).left,
            percent = Math.round((xPos / this.refs.total.getBoundingClientRect().width ) * 100)

        playJumpToPercent(percent)
    }

    render(){
        return (
            <div className="progressBar">
                <a ref="total" className="progressBar-total" onClick={this.onProgressBarClick.bind(this)}>
                    <div className="progressBar-progress" style={{width:this.props.percent}}></div>
                </a>
            </div>
        )
    }
}

View.defaultProps = {
    percent: 0
}

export default connect(
    (state)=>{
        let playing = state.playing || {}

        return {
            percent : playing.percent ? playing.percent + '%' : ''
        }
    }
)(View)