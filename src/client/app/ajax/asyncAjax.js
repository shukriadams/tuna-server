/*
 * Does authenticated ajax call to server. Assumes login session is valid.
 * DO NOT refactor this to async, it will spill out and force refactoring most components to async as well, including
 * react plumbing, which I'm not sure supports async.
 **/

import store from './../store/store'
import { clearSession, alertSet } from './../actions/actions'
import history from './../history/history'
import appSettings from './../appSettings/appSettings'

// url : url to call
// success: callback if error code ===, accepts result as parameter
// error : optional error callback
export default {

    /**
     *
     **/
    async anon(url){
        return await this._do(url, false)
    },


    /**
     *
     **/
    async auth(url){
        return await this._do(url, true)
    },


    /**
     *
     **/
    async _do(url, isAuth, method = 'GET'){
        return new Promise(function(resolve, reject){

            const headers = { 'Content-Type': 'application/json' }

            if (isAuth){
                const session = store.getState().session || {}
                
                if (!session.token){
                    clearSession()
                    history.push('/login')
                    return resolve()
                }
    
                headers['Authorization'] = `Bearer ${session.token}`
            }

            fetch(url, {
                method,
                headers,
            })
            .then(response => {
                if (!response.json){
                    alertSet(response)
                    return reject()
                }

                response.json().then(async (result) => {
                    
                    // auth token no longer value. Because we fetch serverConstants with this method, we need
                    // to bypass serverConstants checks on anon to let serverConstants through.
                    if (isAuth && result.code === appSettings.serverConstants.ERROR_INVALID_USER_OR_SESSION){
                        clearSession()
                        history.push('/login')
                        return resolve(null)
                    }

                    resolve(result)
                })
            })
            .catch(error => {
                // only catastrophic errors should land here. Regular errors from server will be returned as JSON and be handled above
                console.log(error);
                alertSet({
                    message : 'Fatal server error - contact admin',
                    error : true
                })

                reject(error)
            })

        })
    }

}