import appSettings from './../appSettings/appSettings'
import Ajax from './../ajax/ajax'
import { sessionSet } from './../actions/actions'
export default {
    
    /**
     * Fetches only playlists and profile data, songs are deliberately left out to keep call light
     */
    fetchSession: async function(){
        return await this.fetch('playlists,profile')
    },

    /**
     * fetches multiple content from server, requestedTypes is , comma-separated string
     **/
    fetch : async function(requestedTypes){
        return new Promise((resolve, reject)=>{
            try {
                const ajax = new Ajax()

                ajax.auth(`${appSettings.serverUrl}/v1/content/${requestedTypes}`, result => {
                    sessionSet(result.payload)
                    resolve()
                }, result => {
                    // todo : handle error better
                    reject(result.message)
                })
            } catch(ex){
                reject(ex)
            }
        })

    }

}
