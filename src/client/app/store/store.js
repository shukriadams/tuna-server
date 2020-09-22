import { combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'localforage'
import session from './reducers/session'
import playing from './reducers/playing'
import queue from './reducers/queue'
import busy from './reducers/busy'
import playlist from './reducers/playlist'
import search from './reducers/search'
import listContext from './reducers/listContext'
import now from './reducers/now'
import pubsub from './../pubsub/pubsub'

const persistConfig = {
    key: 'root',
    storage,
    // items not persisted
    blacklist : ['playing', 'busy', 'listContext', 'search', 'now', 'playlist']
}

// combine reducers here
let reducers = combineReducers({
    session,
    search,
    playing,
    playlist,
    queue,
    listContext,
    now,
    busy // to show busy dialog set message to anything
})

const persistedReducer = persistReducer( persistConfig, reducers )
let store = createStore(persistedReducer)
let persistor = persistStore(store, {}, function(){
    pubsub.pub('onRehydrated')
});


// general logic for store
let wasAuthenticated = false

store.subscribe(function(){

    let session = store.getState().session || {},
        isAuthenticated = !!session.token

    // no state change
    if (isAuthenticated === wasAuthenticated)
        return

    wasAuthenticated = isAuthenticated
})

window.tunaStore = store
export default store
