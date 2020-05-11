import Jplayer from 'jplayer'; // load into dom
import jQuery from 'jquery'
import store from '../store/store'
import watch from 'redux-watch'

// generic player interface for jplayer so it appears the same as phonegap player
export default class JPlayerWrapper {

    /**
     *
     **/
    constructor(options) { // put in defaults here

        this.root = options.root || null // jquery selector for element to host jplayer
        this.onPlay = options.onPlay || null
        this.onEnd = options.onEnd || null
        this.onReady = options.onReady || null
        this._position = -1
        this._duration = -1

        if (!this.root)
            throw 'Jplayer root element not set'

        this.root = jQuery(this.root)
        this.jPlayer = this.root.jPlayer({
            supplied: 'mp3',
            solution: 'html', // flash breaks on chrome
            errorAlerts: true,
            swfPath: 'media/flash/Jplayer.swf',
            ready : ()=>{

                // passive event : bind the 'onPlaying' event when a song ticks forward
                this.jPlayer.bind($.jPlayer.event.timeupdate, (event)=>{
                    this._position = Math.round(event.jPlayer.status.currentTime)
                    this._duration = Math.round(event.jPlayer.status.duration)

                    if (this.onPlay)
                        this.onPlay()
                })

                // passive event : bind song end event
                this.jPlayer.bind($.jPlayer.event.ended, ()=>{

                    if (this.onEnd)
                        this.onEnd()
                })

                let volume = store.getState().session.volume
                this.setVolume(volume)

                if (this.onReady)
                    this.onReady()
            }
        })

        let volumeWatcher = watch(store.getState, 'session.volume')
        store.subscribe(volumeWatcher((newVolume)=>{
            this.setVolume(newVolume);
        }))
    }


    /**
     *
     **/
    setMedia (url, format){
        let playItem = { title : 'file' }

        if (format === 'mp3')
            playItem.mp3 = url
        else
            throw format + ' is not a suppported format'

        this.jPlayer.jPlayer('setMedia', playItem)
    }


    /**
     *
     **/
    play (){
        this.jPlayer.jPlayer('play')
    }


    /**
     *
     **/
    stop (){
        this.jPlayer.jPlayer('stop')
    }


    /**
     *
     **/
    pause (){
        this.jPlayer.jPlayer('pause')
    }


    /**
     *
     **/
    setVolume (volume){
        volume = volume / 100
        this.jPlayer.jPlayer('volume', volume)
    }


    /**
     *
     **/
    jumpToPosition (position){
        this.jPlayer.jPlayer('playHead', position)
    }


    /**
     * gets current time of current song. return -1 if nothing playing
     **/
    getPosition (){
        return this._position
    }


    /**
     * gets duration of current song. returns -1 if nothing playing
     **/
    getDuration (){
        return this._duration
    }
}