import React from 'react'
import pubsub from './../pubsub/pubsub'
import ClassNames from 'classnames'
import noUiSliderCss from './../localLib/nouislider/nouislider.css!css'
import noUiSlider from './../localLib/nouislider/nouislider'
import { connect } from 'react-redux'
import { volumeSet } from './../actions/actions'
import { replay, playShowSongBrowser, nextRepeatMode, focusPreviousSongInQueue, focusNextSongInQueue, playStart, playPause, playResume } from './../actions/actions'
import debounce from 'debounce'
import vc from 'vcjs'
import { REPEAT_MODE_OFF, REPEAT_MODE_SINGLE, REPEAT_MODE_ALL } from './../misc/repeatModes'
import store from './../store/store'
import watch from 'redux-watch'
import QueueHelper from './../queue/queueHelper'
import ReactSVG from 'react-svg'
import KeyWatcher from './../keyWatcher/index'

class PlayerControls extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            showVolume : false,
            lockControls : false
        }
    }
    
    async componentDidMount() {
        noUiSlider.create(this.refs.volumeSlider, {
            start : [this.props.volume],
            connect: 'lower',
            orientation: 'horizontal',
            direction: 'ltr',
            range: {
                'min': 0,
                'max': 100
            }
        })

        this.refs.volumeSlider.noUiSlider.on('update', debounce(()=>{
            let v = parseInt(this.refs.volumeSlider.noUiSlider.get())
            volumeSet(v)
        }, 50)) // this number controls how responsive volume change feels

        store.subscribe(watch(store.getState, 'playing.percent')(()=>{
            this.setState({ lockControls : false })
        }))

        this.refs.volumeSlider.noUiSlider.on('end', ()=>{
            this.hideVolume()
        })

        // note : use pubsub instead of direct document event binding as latter doens't unmount cleanly
        pubsub.sub('playerControls', 'document.clicked', this.handleOnOffClick.bind(this))

        this.rightKey = new KeyWatcher({
            key : 'ArrowRight',
            onDown : ()=>{
                this.next()
            }
        })

        this.leftKey = new KeyWatcher({
            key : 'ArrowLeft',
            onDown : ()=>{
                this.back()
            }
        })

        this.escapeKey = new KeyWatcher({
            key : 'Escape',
            onDown : ()=>{
                playPause();
            }
        })
    }

    componentWillUnmount() {
        this.rightKey.dispose()
        this.leftKey.dispose()
        this.escapeKey.dispose()

        pubsub.unsub('playerControls', 'document.clicked')
    }


    /**
     *
     */
    handleOnOffClick(e){
        // ignore if click is from volume content
        if (e.target === this.refs.volumeTrigger || vc.isDescendentOf(e.target, this.refs.volumeWrapper))
            return

        this.hideVolume()
    }

    /**
     *
     */
    toggleBrowser (){
        playShowSongBrowser()
    }

    back(){
        if (this.props.playNotPossible || this.state.lockControls)
            return

        if (this.props.time > 5 || !QueueHelper.canQueueRetreat())
            replay()
        else
            focusPreviousSongInQueue()

    }

    next(){
        if (this.props.playNotPossible || this.state.lockControls)
            return

        focusNextSongInQueue()
    }

    togglePlay(){
        if (this.props.playNotPossible || this.state.lockControls)
            return

        if (this.props.playKey){
            if (this.props.isPaused)
                playResume()
            else
                playPause()
        } else {
            this.setState({ lockControls : true })
            playStart()
        }
    }

    showVolume(){
        this.setState({ showVolume : true })
    }

    hideVolume(){
        this.setState({ showVolume : false })
    }

    render(){
        let rootClassNames = ClassNames(
            'playerControls',
            {
                'playerControls--locked' :  this.state.lockControls,
                'playerControls--disabled' : this.props.playNotPossible,
                'playerControls--small' : this.props.smallMode
            }),
            loopClassNames = ClassNames(
                'playerControls-icon playerControls-repeat',
                {
                    'playerControls-repeat--off' : this.props.repeatMode === REPEAT_MODE_OFF
                }
            ),
            forwardClassNames = ClassNames(
                'playerControls-controlLink playerControls-next',
                {
                    'playerControls-controlLink--inactive' : this.props.repeatMode !== REPEAT_MODE_ALL && !QueueHelper.canQueueAdvance(false) // !isPassive
                }
            )

        let showPlayIcon = this.props.playKey === null || this.props.isPaused === true

        return (
            <div className={rootClassNames} >
                <div className="playerControls-mainControls">
                    <div className="playerControls-controlContainer playerControls-searchContainer">
                        <a className="playerControls-controlLink" onClick={this.toggleBrowser.bind(this)} title="Browse files">
                            <ReactSVG path="/media/svg/search.svg" className="playerControls-icon" />
                        </a>
                    </div>
                    <div className="playerControls-controlContainer">
                        <a className="playerControls-controlLink playerControls-previous" onClick={this.back.bind(this)} title="Previous">
                            <ReactSVG path="/media/svg/rewind.svg" className="playerControls-icon" />
                        </a>
                    </div>
                    <div className="playerControls-controlContainer">
                        <a className="playerControls-controlLink playerControls-play" onClick={this.togglePlay.bind(this)} title="Play">
                            <ReactSVG path={`/media/svg/${showPlayIcon ?  'play' : 'stop'}.svg`} className="playerControls-icon" />
                        </a>
                    </div>
                    <div className="playerControls-controlContainer">
                        <a className={forwardClassNames} onClick={this.next.bind(this)} title="Next">
                            <ReactSVG path="/media/svg/forward.svg" className="playerControls-icon" />
                        </a>
                    </div>
                    <div className="playerControls-controlContainer">
                        <a ref="volumeTrigger" onClick={this.showVolume.bind(this)} className="playerControls-controlLink" title="Volume">
                            <ReactSVG path="/media/svg/volume.svg" className="playerControls-icon" />
                        </a>
                    </div>
                    <div className="playerControls-controlContainer playerControls-repeatContainer">
                        <a className="playerControls-controlLink" onClick={nextRepeatMode} title="Repeat : {this.props.repeatMode}">
                            <ReactSVG path={`/media/svg/loop.svg`} className={loopClassNames} />
                            {
                                this.props.repeatMode === REPEAT_MODE_SINGLE &&
                                    <div className="playerControls-singleLoop">1</div>
                            }
                        </a>
                    </div>
                </div>

                <div ref="volumeWrapper" className={ClassNames('playerControls-volumeWrapper', {'playerControls-volumeWrapper--show' : this.state.showVolume })}>
                    <div className="playerControls-volumeInner">
                        <div className="playerControls-volumeLabel">Volume</div>
                        <a onClick={this.hideVolume.bind(this)} className="playerControls-closeVolume">
                            <i className="playerControls-closeVolumeIcon icon-close" title="Close"></i>
                        </a>
                        <div ref="volumeSlider" className="playerControls-volumeSlider"></div>
                    </div>
                </div>

            </div>
        )
    }
}

// redux mapping
export default connect(
     (state)=>{
        return {
            time : state.playing.time,
            volume : state.session.volume,
            repeatMode : state.session.repeatMode,
            playKey : state.playing.playKey,
            isPaused : state.playing.isPaused,
            smallMode : !state.now.playstripFullSize,
            playNotPossible : state.queue.songs.length === 0
        }
    }

)(PlayerControls)