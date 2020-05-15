/**
 *
 */
import React from 'react'
import Pubsub from './../pubsub/pubsub'
import {  Router, Switch, Route } from 'react-router-dom'
import Store from './../store/store'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import Home from './../pages/home'
import Login from './../pages/login'
import Settings from './../pages/settings'
import Help from './../pages/help'
import Import from './../pages/import'
import FourOhFour from './../pages/fourOhFour'
import PrivateRoute from './privateRoute'
import ResetPassword from './../pages/resetPassword'
import How from './../pages/how'
import NewPassword from './../pages/newPassword'
import KitchenSink from './../kitchenSink/kitchenSink'
import gluActiveMediaQuery from './../glu_activeMediaQuery/index'
import Reload from './../pages/reload'
import history from './../history/history'
import VerifyEmail from './../pages/verifyEmail'
import DeleteProfile from './../pages/deleteProfile'
import DeletedProfile from './../pages/deletedProfile'
import SessionExpired from './../pages/sessionExpired'
import About from './../pages/about'
import Terms from './../pages/termsOfService'
import appSettings from './../appSettings/appSettings'
import ajax from './../ajax/asyncAjax'
import player from './../player/player' // importing the player here is enough to initialize it
import socketHelper from './../helpers/socketio' // importing triggers binding
import { clearSession, songsSet, playListSetAll } from './../actions/actions'
import { PROFILE, IMPORT } from './../routes/routes'
import storeWatchers from './../store/storeWatchers'
import contentHelper from './../helpers/contentHelper'

(async ()=>{

    gluActiveMediaQuery.initialize()

    await appSettings.update()

    Pubsub.when('app', 'onRehydrated', async ()=>{

        // start the router to start the app
        ReactDOM.render(
            <Router history={history}>
                <Provider store={Store}>
                    <Switch>
                        <PrivateRoute exact path={`/${PROFILE}`} component={Settings}/>
                        <PrivateRoute exact path={`/${IMPORT}`} component={Import}/>
                        <PrivateRoute exact path="/deleteAccount" component={DeleteProfile}/>
                        <PrivateRoute exact path="/reload" component={Reload}/>
                        <Route exact path="/deleted" component={DeletedProfile}/>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/terms-of-service" component={Terms}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/about" component={About}/>
                        <Route exact path="/help" component={Help}/>
                        <Route exact path="/resetPassword" component={ResetPassword}/>
                        <Route exact path="/how" component={How}/>
                        <Route exact path="/newPassword" component={NewPassword}/>
                        <Route exact path="/kitchenSink" component={KitchenSink}/>
                        <Route exact path="/verifyemail" component={VerifyEmail}/>
                        <Route exact path="/session-expired" component={SessionExpired}/>
                        <Route component={FourOhFour} />
                    </Switch>
                </Provider>
            </Router>,
            document.getElementById('root')
        )

        player.init()

        // set up interaction store logic after store has loaded
        storeWatchers()

        // check if session is valid
        const session = Store.getState().session || {},
            songsHash = session.songsHash,
            token = session.token

        // always check session on app load. session can be expired, or state can have changed
        const result = await ajax.anon(`${appSettings.serverUrl}/v1/session/isvalid?token=${token}&songsHash=${songsHash}`)
        if (!result.code){
            // auth token no longer value
            if (!result.payload.isValid)
                clearSession()
            else if (!result.payload.songsAreValid){
                let content = await contentHelper.fetch('songs,playlists,profile')
                songsSet(content.songs)
                playListSetAll(content.playlists)                       
            }
        }

    })

})()
