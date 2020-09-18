import store from './../store/store'
import { clearSession, alertSet } from './../actions/actions'
import history from './../history/history'
import appSettings from './../appSettings/appSettings'

/**
* url : url to call
 * success: callback if error code ===, accepts result as parameter
 * error : optional error callback
 */
export default {

    /**
     *
     **/
    async anonGet(url){
        return await this._do(url, false)
    },


    /**
     * Gets with authorization
     **/
    async authGet(url){
        return await this._do(url, true)
    },


    /**
     *
     */
    async post(url, data ){
        return await this._do(url, true, 'POST', data)
    },

    /**
     * 
     */
    postCallback(url, data, success, error){
        if (!success || !error)
            throw 'success or error callbacks not set'

        ;(async ()=>{
            try {
                const result = await this._do(url, true, 'POST', data)
                success(result)
            } catch (ex){
                error(ex)
            }
        })()
    },

    /**
     *
     */
    async postAnon(url, data ){
        return await this._do(url, false, 'POST', data)
    },


    /**
     *
     */
    async delete(url){
        return await this._do(url, true, 'DELETE')
    },


    /**
     *
     **/
    async _do(url, isAuth, method = 'GET', data){
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
                body: data ? JSON.stringify(data) : null,
            })
            .then(response => {

                response.text().then(async (json) => {
                    try {
                        const result = JSON.parse(json)
                        // auth token no longer value. Because we fetch serverConstants with this method, we need
                        // to bypass serverConstants checks on anon to let serverConstants through.
                        if (isAuth && result.code === appSettings.serverConstants.ERROR_INVALID_USER_OR_SESSION){
                            clearSession()
                            history.push('/login')
                            return resolve(null)
                        }

                        resolve(result)

                    } catch (ex){
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
                    
                // only catastrophic errors should land here. Regular errors from server will be returned as JSON and be handled above
                console.log(error)
                alertSet({
                    message : 'Fatal server error - contact admin',
                    error : true
                })
            })

        })
    }

}