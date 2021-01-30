/*
 * Does authenticated ajax call to server. Assumes login session is valid.
 * DO NOT refactor this to async, it will spill out and force refactoring most components to async as well, including
 * react plumbing, which I'm not sure supports async.
 **/

import store from './../store/store'
import appSettings from './../appSettings/appSettings'
import { clearSession, alertSet } from './../actions/actions'
import history from './../history/history'

// url : url to call
// success: callback if error code ===, accepts result as parameter
// error : optional error callback
export default class {

    /**
     *
     */
    anon(url, success, error){
        this._do(url, false, 'GET', success, error)
    }


    /**
     *
     */
    auth(url, success, error){
        this._do(url, true, 'GET', success, error)
    }

    /**
     *
     */
    postAuth(url, data, success, error){
        this._do(url, true, 'POST', success, error, data)
    }

    deleteAuth(url, success, error){
        this._do(url, true, 'DELETE', success, error)
    }

    /**
     *
     */
    postAnon(url, data, success, error){
        this._do(url, false, 'POST', success, error, data)
    }

    /**
     *
     */
    _do(url, isAuth, method, resolve, reject, data){

        const headers = { 'Content-Type': 'application/json' }

        if (isAuth){
            const session = store.getState().session || {}
            
            if (!session.token){
                clearSession()
                history.push('/login')
                return
            }

            headers['Authorization'] = `Bearer ${session.token}`
        }

        fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        })
        .then(response => {

            response.text().then(async (json) => {
                try {
                    const result = JSON.parse(json)

                    // intercept common errors
                    if (result.errorCode === appSettings.serverConstants.ERROR_INVALID_USER_OR_SESSION){
                        // auth token no longer value
                        clearSession()
                        history.push('/login')
                    }
                    
                    // some kind of "expected" error has been returned from server, display it to user and do nothing else
                    if (result.errorCode)
                        return alertSet(result)

                    if (resolve)
                        await resolve(result)

                }catch(ex){
                    ex = {
                        message : 'failed to parse expected JSON response',
                        ex,
                        response : json
                    }

                    if (reject)
                        return reject(ex)
                    
                    console.log(ex)
                    alertSet({
                        message : 'Unhandled error',
                        error : true
                    })
       
                }

            })
        })
        .catch(error => {
            if (reject)
                return reject(error)

            // only unhandled errors should land here. Regular errors from server will be returned as JSON and be handled above
            console.log(error)
            
            alertSet({
                message : 'Fatal server error - contact admin',
                error : true
            })
        })
    }

}