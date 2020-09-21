import player from './playerWrapper'
import Ajax from './../ajax/ajax'
import appSettings from './../appSettings/appSettings'
import BlobStore from './../blobStore/blobStore'
import store from './../store/store'
import { playTick, playStop, playStart } from './../actions/actions'
import playing from './../store/reducers/playing'
import queueHelper from './../queue/queueHelper'
import { playResume, playDownloading, focusNextSongInQueue, replay } from './../actions/actions'
import watch from 'redux-watch'
import debug from './../misc/debug'
import debounce from 'debounce'

class Player {

    /**
     * Needs
     * settings
     * authAjax
     * store
     * profile
     **/
    constructor() {

        this.isPlaying = false
        this.currentSong = null
        this.currentSongDuration = null // must be calculated on the fly
        this.player = null         // player - jplayer, phoengap or something else
        this.trackScrobbled = false
        this.triggeredStarted = false

        let session = store.getState().session
        this.volume = session.volume
        this.repeatMode = session.repeatMode
        this.player = new player({
            onPlay : ()=>{
                this._onSongTick()
            },
            onReady : ()=>{
                this.player.onEnd =()=>{
                    this._onSongEnd()
                }
            }
        })
        this.attemptScrobbleDebounced = debounce(this._attemptScrobble.bind(this), 500)
        this._bindEvents()
    }


    /**
     *
     **/
    _bindEvents(){

        // handle song removal from queue
        store.subscribe(watch(store.getState, 'queue.songs')((songs)=>{
            debug('player > queue.songs');
            // this was breaking lots of weird things, so commented out
            // if queue no longer contains currently playing song, force a next
            //if (this.currentSong && !songs.includes( this.currentSong.id))
            //    replay();
        }))

        // handle forward or back in queue
        store.subscribe(watch(store.getState, 'queue.index')(()=>{
            debug('player > queue.index');

            if (this.isPlaying)
                this._playCurrentSong(false, ()=>{
                    playResume() // force unpause, workaround for when we jump+play when already paused
                })
        }))


        // handle song auditions
        store.subscribe(watch(store.getState, 'queue.auditionedSongId')(()=>{
            debug('player > queue.auditionedSongId')

            if (this.isPlaying)
                this._playCurrentSong(false, function(){
                    playResume()  // force unpause, workaround for when we jump+play when already paused
                })
        }))

        // either playing.playKey or playing.play can trigger playing. First one in wins. Both can also stop playing
        // we don't care about double stopping


        // handles play order - this will be triggered when playHash is set, this is done by clicking play button or
        // double clicking on a song in list for ex.
        store.subscribe(watch(store.getState, 'playing.playKey')((playKey)=>{
            debug('player > playing.playKey');

            if (!playKey)
                return this.stopPlay();

            this._playCurrentSong(true);
        }))


        // handle pause/resume
        store.subscribe(watch(store.getState, 'playing.isPaused')((pause)=>{
            debug('player > playing.isPaused')

            if (!this.isPlaying)
                return

            if (pause)
                return this.player.pause()

            this.player.play()
        }))

        store.subscribe(watch(store.getState, 'playing.jumpToPercent')((percent)=>{
            debug('player > playing.jumpToPercent')

            this._jumpToPosition(percent)
        }))
    }


    /**
     * This should always be the entry point for a playing a song. Queues or fetches a media url for the given song
     * from server.
     *
     * Note : player has no knowledge of playlists, it fetches the next song from the queue.
     */
    _playCurrentSong (force, callback) {
        let nextSong = queueHelper.getCurrentSong()

        if (!nextSong)
            return this.stopPlay()

        // already playing song, ignore
        if (!force && this.currentSong && this.currentSong.id === nextSong.id)
            return

        // get media url from server

        this.isPlaying = true
        playDownloading()
        this._getOrDownloadSong(nextSong, (mediaUrl)=>{
            this.currentSong = nextSong

            this.nextSongLoaded = false
            this.player.setMedia(mediaUrl, 'mp3')
            this.player.play()

            this.currentSongDuration = null
            this.trackScrobbled = false
            this.triggeredStarted = false

            if (callback)
                callback()

            let ajax = new Ajax();
            ajax.postAuth(`${appSettings.serverUrl}/v1/playing`,
                {
                    song : this.currentSong.id
                },
                function(response){
                    // todo : write this to user on-screen log
                }
            )
        })

        // common logic for after play has started
        
    }


    /**
     * Callback is optional
     */
    _getOrDownloadSong(song, callback){
        (async function(){
            let blobStore = new BlobStore()

            let localMediaUrl = await blobStore.getLocalMediaUrl(song.id)
            // if localMediaUrl exists, song is already present in browser and there's no need to proceed with download
            if (localMediaUrl)
                return callback ? callback(localMediaUrl) : null
            

            // get media url from server
            new Ajax().auth(
                `${appSettings.serverUrl}/v1/song/${song.id}`,
                function(response){
                    // on ios never download locally as this isn't allowed
                    if (!!navigator.userAgent.match(/iPhone|iPod|iPad/) || !!navigator.platform.match(/iPhone|iPod|iPad/))
                        return callback ? callback(response.payload.url) : null

                    blobStore.getOrDownload(song, song.id /* no longer using hashId here */, response.payload.url, function(localMediaUrl){

                        if (callback)
                            callback(localMediaUrl)
                    })
                },
                function(response){
                    // song id is invalid
                    blobStore.flush()
                })
        }())
    }

    
    /**
     * Logic for stopping a track play
     */
    stopPlay () {
        // jplayer throws exception if attempting to stop while not playing
        if (!this.isPlaying)
            return

        // todo : check if playing first, else player writes error to console
        this.player.stop()
        this.isPlaying = false
        this.currentSongDuration = null
        playStop()
    }


    /**
     * Invoked when a song naturally reaches its end
     */
    _onSongEnd () {
        if (queueHelper.canQueueAdvance(true)){ // true = passive
            playStop(); // must force a stop in case there is only 1 song in queue, when it jumps it itself it wont register as a next
            // false means this is a passive transition
            focusNextSongInQueue({ isPassive : true })
            playStart()
        }
        else
            this.stopPlay()
    }


    /**
     *
     */
    _jumpToPosition (percent){
        if (!this.currentSongDuration)
            return

        if (!this.isPlaying)
            return

        // convert peercent to seconds
        const seconds = Math.floor(percent * this.currentSongDuration / 100)
        this.player.jumpToPosition(seconds)
    }


    /**
     * Fired each second the player ticks forward in a song
     */
    _onSongTick () {

        // set current and total time of song
        let profile = store.getState().session, //todo : assert profile, if null will explode
            time = this.player.getPosition(),
            duration = null

        // trigger play start only once song has ticked, this is the only reliable way to do it
        if (!this.triggeredStarted)
            this.triggeredStarted = true
        

        // try to determine duration - if song doesn't have it as embedded value, wait
        // for player's song length to stabilize, then use that.
        if (this.currentSong.duration === 0)
        {
            let thisDuration = this.player.getDuration()
            if  (thisDuration !== this.lastObservedDuration){
                this.lastObservedDuration = thisDuration
            } else {
                duration = thisDuration
            }
        } else {
            duration  = this.currentSong.duration
        }

        if (duration !== null) // ?? needed
            this.currentSongDuration = duration


        // send a scrobble order to backend once the halfway point of the song has passed.
        if (profile.isScrobbling && !this.trackScrobbled && time > (duration / 2))
            this.attemptScrobbleDebounced()

        // try to prefetch next song
        if (!this.nextSongLoaded && time > (duration / 2)){
            let song = queueHelper.peakNextSong()
            if (song)
                this._getOrDownloadSong(song)

            this.nextSongLoaded = true
        }

        // write song progress back to redux, this is vital to inform rest of the app that playing is ongoing
        if (duration !== null) { // ?? needed
            let percent = Math.floor((time * 100 ) / duration)
            playTick({ artist: this.currentSong.artist, song: this.currentSong.name, time : time, duration : duration, percent : percent })
        }
    }

    _attemptScrobble(){
        let ajax = new Ajax(),
            songDuration = this.currentSongDuration,
            song = this.currentSong.id

        ajax.auth(`${appSettings.serverUrl}/v1/lastfm/scrobble?song=${song}&songDuration=${songDuration}` , (result) =>{
            if (!result.code && result.payload.scrobbled){
                // todo inform user of teh win
                console.log('track scrobbled') // todo : move this to ui console out
                this.trackScrobbled = true
            }
        })
    }
}


let _instance = null

export default {
    init(){
        if (!_instance){
            _instance = new Player( )
        }
    }
}