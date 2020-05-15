export default {

    /**
     * Requires playing from state
     */
    isMusicPlayingNow : (playing)=>{
        return !playing.isPaused && playing.playKey !== null
    }
}