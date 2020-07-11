import store from '../store/store'
import watch from 'redux-watch'
import { Howl } from 'howler'

/**
 * Generic player interface for whatever player we're using - use this to present a simplified interface of player,
 * as well as allowing for different player implimentations on specific platforms if necessary.
 */
export default class {

    /**
     *
     **/
    constructor(options) { // put in defaults here

        this.onPlay = options.onPlay || null
        this.onEnd = options.onEnd || null
        this.onReady = options.onReady || null
        this._position = -1
        this._duration = -1
    }


    /**
     * Sets the media for the current song to play. This doesn't play the song 
     **/
    setMedia (url, format){
        if (this._updateTimer)
            clearInterval(this._updateTimer)

        this.player = new Howl({
            src : [url],
            format,
            onend :()=>{
                if (this.onEnd)
                    this.onEnd()
            }
        })

        this._updateTimer = setInterval(()=>{
            this._position = Math.round(this.player.seek())
            this._duration = Math.round(this.player.duration())

            if (this.onPlay)
                this.onPlay()
        }, 500)
        
        let volumeWatcher = watch(store.getState, 'session.volume')
        store.subscribe(volumeWatcher((newVolume) => {
            this.player.volume(newVolume / 100) // convert from 0-100 to 0-1
        }))

        this.player.volume(store.getState().session.volume)

        if (this.onReady)
            this.onReady()
    }


    /**
     * Starts / continues playing the current song
     **/
    play (){
        this.player.play()
    }


    /**
     * Stops the currently playing song
     **/
    stop (){
        this.player.stop()
    }


    /**
     * Pauses the currently playing song
     **/
    pause (){
        this.player.pause()
    }


    /**
     * Jumps the player to a position in the currently playing song
     **/
    jumpToPosition (position){
        console.log(this._duration, this._position, position)
        this.player.seek(position)
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