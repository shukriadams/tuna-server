import JPlayerWrapper from './jPlayerWrapper'
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

class Player {

    /**
     * Needs
     * settings
     * authAjax
     * store
     * profile
     **/
    constructor(options) {

        if (!options.element)
            throw 'Player expects an element to bind to';

        let self = this,
            PlayerType = JPlayerWrapper;

        this.isPlaying = false;
        this.currentSong = null;
        this.currentSongDuration = null; // must be calculated on the fly
        this.player = null;         // player - jplayer, phoengap or something else
        this.trackScrobbled = false;
        this.triggeredStarted = false;

        let session = store.getState().session;
        this.volume = session.volume;
        this.repeatMode = session.repeatMode;
        this.player = new PlayerType({
            root : options.element,
            onPlay : function(){
                self._onSongTick();
            },
            onReady : function(){
                self.player.onEnd = function(){
                    self._onSongEnd();
                }
            }.bind(this)
        });

        this._bindEvents();
    }


    /**
     *
     **/
    _bindEvents(){

        // handle song removal from queue
        store.subscribe(watch(store.getState, 'queue.songs')(function(songs) {
            debug('player > queue.songs');
            // this was breaking lots of weird things, so commented out
            // if queue no longer contains currently playing song, force a next
            //if (this.currentSong && !songs.includes( this.currentSong.id))
            //    replay();
        }.bind(this)))

        // handle forward or back in queue
        store.subscribe(watch(store.getState, 'queue.index')(function() {
            debug('player > queue.index');

            if (this.isPlaying)
                this._playCurrentSong(false, function(){
                    playResume(); // force unpause, workaround for when we jump+play when already paused
                });
        }.bind(this)));


        // handle song auditions
        store.subscribe(watch(store.getState, 'queue.auditionedSongId')(function() {
            debug('player > queue.auditionedSongId');

            if (this.isPlaying)
                this._playCurrentSong(false, function(){
                    playResume();  // force unpause, workaround for when we jump+play when already paused
                });
        }.bind(this)));

        // either playing.playKey or playing.play can trigger playing. First one in wins. Both can also stop playing
        // we don't care about double stopping


        // handles play order - this will be triggered when playHash is set, this is done by clicking play button or
        // double clicking on a song in list for ex.
        store.subscribe(watch(store.getState, 'playing.playKey')(function(playKey) {
            debug('player > playing.playKey');

            if (!playKey)
                return this.stopPlay();

            this._playCurrentSong(true);
        }.bind(this)));


        // handle pause/resume
        store.subscribe(watch(store.getState, 'playing.isPaused')(function(pause) {
            debug('player > playing.isPaused');

            if (!this.isPlaying)
                return;

            if (pause)
                return this.player.pause();

            this.player.play();

        }.bind(this)));

        store.subscribe(watch(store.getState, 'playing.jumpToPercent')(function(percent) {
            debug('player > playing.jumpToPercent');

            this._jumpToPosition(percent);
        }.bind(this)));
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
        this._getOrDownloadSong(nextSong, playStart.bind(this))

        // common logic for after play has started
        function playStart(mediaUrl){
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
            ajax.postAuth(`${appSettings.serverUrl}/v1/songs/nowplaying`,
                {
                    song : this.currentSong.id
                },
                function(response){
                    // todo : write this to user on-screen log
                }
            )
        }
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
                `${appSettings.serverUrl}/v1/songs/url?song=${song.id}`,
                function(response){
                    blobStore.getOrDownload(song, song.id /* no longer using hashId here */, response.payload.url, function(localMediaUrl){

                        if (callback)
                            callback(localMediaUrl);
                    });
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

        this.player.jumpToPosition(percent)
    }


    /**
     * Fired each second the player ticks forward in a song
     */
    _onSongTick () {

        // set current and total time of song
        let self = this,
            profile = store.getState().session, //todo : assert profile, if null will explode
            time = this.player.getPosition(),
            duration = null

        // trigger play start only once song has ticked, this is the only reliable way to do it
        if (!this.triggeredStarted)
            this.triggeredStarted = true
        

        // try to determine duration - if song doesn't have it as embedded value, wait
        // for player's song length to stabilize, then use that.
        if (this.currentSong.duration === 0)
        {
            let thisDuration = this.player.getDuration();
            if  (thisDuration !== this.lastObservedDuration){
                this.lastObservedDuration = thisDuration;
            } else {
                duration = thisDuration
            }
        } else {
            duration  = this.currentSong.duration
        }

        if (duration !== null) // ?? needed
            this.currentSongDuration = duration


        // send a scrobble order to backend once the halfway point of the song has passed.
        if (profile.isScrobbling && !this.trackScrobbled && time > (duration / 2)){
            self.trackScrobbled = true;

            let ajax = new Ajax(),
                songDuration = this.currentSongDuration,
                song = this.currentSong.id

            ajax.auth(`${appSettings.serverUrl}/v1/lastfm/scrobble?song=${song}&songDuration=${songDuration}` , function(result){
                if (!result.code){
                    // todo inform user of teh win
                    console.log('track scrobbled') // todo : move this to ui console out
                } else {
                    console.log('scrobble failed : ' + result.message ) // todo : move this to ui console out
                }
            })
        }

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

}


let _instance = null

export default {
    init(){
        if (!_instance){
            _instance = new Player( {
                element : document.getElementById('player'),
            });
        }
    }
}