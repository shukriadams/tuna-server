import store from './../store/store';
import { 
    LISTCONTEXT_CLEARDRAGGEDOVERITEM, 
    LISTCONTEXT_SETDRAGGEDOVERITEM, 
    LISTCONTEXT_CLEAR_SELECTION, 
    LISTCONTEXT_OPEN_CONTEXT_MENU, 
    LISTCONTEXT_CLOSE_CONTEXT_MENU, 
    LISTCONTEXT_ROW_CLICKED 
} from './../constants/constants';


const
    openContextMenu = (listId, songId) => store.dispatch({ type: LISTCONTEXT_OPEN_CONTEXT_MENU, listId : listId, songId : songId}),
    closeContextMenu = (listId) => store.dispatch({ type: LISTCONTEXT_CLOSE_CONTEXT_MENU, listId : listId }),
    rowClicked = (listId, row) =>  store.dispatch({ type: LISTCONTEXT_ROW_CLICKED, listId : listId, row : row }),
    clearSelectedRows = (listId) =>  store.dispatch({ type: LISTCONTEXT_CLEAR_SELECTION, listId : listId }),
    setDraggedOverItem = (listId, songId, isScrollingPastCurrent) => store.dispatch({ type: LISTCONTEXT_SETDRAGGEDOVERITEM, listId : listId, songId : songId, isScrollingPastCurrent: isScrollingPastCurrent }),
    clearDraggedOverItem = (listId) => store.dispatch({ type: LISTCONTEXT_CLEARDRAGGEDOVERITEM, listId : listId }),

    // session
    sessionSet = (session) => store.dispatch({ type: 'SESSION_SET', session : session }),
    volumeSet = (volume) => store.dispatch({ type: 'SESSION_SETVOLUME', volume: volume }),

    // playlist
    playlistSet = (playlistId) => store.dispatch({ type: 'PLAYLIST_SET', playlistId: playlistId }),
    playlistUnset = () => store.dispatch({ type: 'PLAYLIST_UNSET' }),
    playlistDirty = () => store.dispatch({ type: 'PLAYLIST_DIRTY' }),
    playlistClean = () => store.dispatch({ type: 'PLAYLIST_CLEAN' }),
    playListSetAll = (playlists) => store.dispatch({ type: 'SESSION_SETPLAYLISTS', playlists }),

    // use this to log the user out
    clearSession = () => store.dispatch({ type: 'CLEAR_SESSION' }),
    removeLastfm = () => store.dispatch({ type: 'REMOVE_LASTFM' }),
    songsSet = songs => store.dispatch({ type: 'SET_SONGS', songs : songs }),

    // search
    search = search => store.dispatch({ type: 'SEARCH_CHANGED', search }),

    alertSet = alert => store.dispatch({ type : 'NOW_ALERTSET', alert }),
    alertClear = () => store.dispatch({ type : 'NOW_ALERTCLEAR'  }),

    // playing
    playTick = playInfo => store.dispatch({ type: 'PLAY_TICK', playInfo }),
    playStart = () => store.dispatch({ type: 'PLAY_START' }),
    replay = () => store.dispatch({ type: 'PLAY_REPLAY' }),
    playStop = () => store.dispatch({ type: 'PLAY_STOP' }),
    playPause = () => store.dispatch({ type: 'PLAY_PAUSE' }),
    playResume = () => store.dispatch({ type: 'PLAY_RESUME' }),
    playJumpToPercent = (percent) => store.dispatch({ type: 'PLAY_JUMPTOPERCENT', percent : percent }),
    playDownloading = () => store.dispatch({ type: 'PLAY_DOWNLOADING' }),
    playShowSongBrowser = () => store.dispatch({ type: 'PLAY_SHOWSONGBROWSER' }),
    playHideSongBrowser = () => store.dispatch({ type: 'PLAY_HIDESONGBROWSER' }),

    // now
    nowLayoutLarge = () => store.dispatch({ type: 'NOW_PLAYSTRIPMODE', playstripFullSize : true, showPlayer: true }),
    nowLayoutSmall = () => store.dispatch({ type: 'NOW_PLAYSTRIPMODE', playstripFullSize : false, showPlayer: true }),
    nowLayoutNone = () => store.dispatch({ type: 'NOW_PLAYSTRIPMODE', playstripFullSize : false, showPlayer: false }),
    nowPlaylistsDialogShow = () => store.dispatch({ type: 'NOW_SHOWPLAYLISTSDIALOG' }),
    nowPlaylistsDialogHide = () => store.dispatch({ type: 'NOW_HIDEPLAYLISTSDIALOG' }),

    // player
    nextRepeatMode = () => store.dispatch({ type: 'NEXT_REPEAT_MODE' }),

    // queue : add array of songs to queue
    // adds a song to the end of the queue
    addToQueue = (songIds) => store.dispatch({ type: 'ADD_TO_QUEUE', songIds: songIds }),
    setQueue = (songIds) => store.dispatch({ type: 'SET_TO_QUEUE', songIds: songIds }),
    removeFromQueue = (songIds) => store.dispatch({ type: 'REMOVE_FROM_QUEUE', songIds: songIds}),
    // plays a specific song in queue. that song will be the active one, and queue will continue forward from there
    focusSongInQueue = (songId) => store.dispatch({ type : 'FOCUS_SONG_IN_QUEUE', songId : songId}),
    focusNextSongInQueue = (args) => store.dispatch({ type : 'QUEUE_FORWARD', isPassive : args && args.isPassive, repeatMode: store.getState().session.repeatMode }),
    focusPreviousSongInQueue = () => store.dispatch({ type : 'QUEUE_BACK' }),
    clearQueue = () => store.dispatch({ type : 'CLEAR_QUEUE' }),
    moveSongsInQueue = (songIds, position) => store.dispatch({ type: 'QUEUE_MOVE_SONGS', songIds : songIds, position : position }),
    auditionSong = (songId) => store.dispatch({ type: 'QUEUE_AUDITION', songId : songId }),

    //
    busy = (message) => store.dispatch({ type : 'BUSY', message :  message }),
    notBusy = () => store.dispatch({ type : 'NOT_BUSY'}),

    // songs
    loveSong = (songId) => store.dispatch({ type: 'SONG_LOVE', songId : songId }),
    unloveSong = (songId) => store.dispatch({ type: 'SONG_UNLOVE', songId : songId });

export {
    alertSet,
    alertClear,
    setQueue,
    playListSetAll,
    playlistSet,
    playlistUnset,
    playlistDirty,
    playlistClean,
    nowPlaylistsDialogShow,
    nowPlaylistsDialogHide,
    clearSelectedRows,
    openContextMenu,
    closeContextMenu,
    rowClicked,
    setDraggedOverItem,
    clearDraggedOverItem,
    sessionSet,
    songsSet,
    removeLastfm,
    clearSession,
    volumeSet,
    playTick,
    playStop,
    playPause,
    playResume,
    playStart,
    replay,
    playJumpToPercent,
    playDownloading,
    playShowSongBrowser,
    playHideSongBrowser,
    addToQueue,
    removeFromQueue,
    focusSongInQueue,
    focusNextSongInQueue,
    focusPreviousSongInQueue,
    busy,
    clearQueue,
    moveSongsInQueue,
    nextRepeatMode,
    notBusy,
    nowLayoutSmall,
    nowLayoutLarge,
    nowLayoutNone,
    search,
    loveSong,
    unloveSong,
    auditionSong
}

