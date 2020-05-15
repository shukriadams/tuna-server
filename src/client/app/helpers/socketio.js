import io from 'socket.io-client'
import appSettings from './../appSettings/appSettings'
import store from './../store/store'
import Pubsub from './../pubsub/pubsub'
import watch from 'redux-watch'
import pubsub from './../pubsub/pubsub'
import debug from './../misc/debug'
import { songsSet, playListSetAll } from './../actions/actions'
import contentHelper from './../helpers/contentHelper'

let _socket = null

let initializeSockets = token => {

    _socket = io.connect(appSettings.serverUrl, {reconnect: true})

    _socket.on('dropbox.connected', ()=>{
        pubsub.pub('dropbox.connected')
    })

    _socket.on('songs.imported', ()=>{
        debug('songs imported!')
    })

    _socket.on('request.authToken', ()=>{
        debug('server requested token')
        _socket.emit('response.authToken', { authToken : token })
    })

    _socket.on('import.progress', message => {
        pubsub.pub('import.progress', message)
    })

}

// handle auth change events
store.subscribe(watch(store.getState, 'session.token')( token => {
    let isLoggedIn = !! token

    if (!isLoggedIn){

        if (_socket)
            _socket.emit('notify.logout', { authToken : token })

        return
    }

    initializeSockets(token)
}))


Pubsub.sub('sockets', 'onRehydrated', function(){
    // triggered when app starts, if authed, start sockets
    let token = store.getState().session.token,
        isLoggedIn = !!token

    if (!isLoggedIn)
        return

    initializeSockets(token)
})

/**
 * Listens for daemon-driven song imports and fetches songs in response. If the app is currently on 
 * import page a manual import is in progress, so do nothing
 */
pubsub.sub('import', 'import.progress', async data =>{
    if (!data.complete)
        return

    if (window.location.href.endsWith('/import'))
        return

    const content = await contentHelper.fetch('songs,playlists')
    songsSet(content.songs)
    playListSetAll(content.playlists)

})