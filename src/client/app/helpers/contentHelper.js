import appSettings from './../appSettings/appSettings'
import ajax from './../ajax/asyncAjax'
import { sessionSet } from './../actions/actions'
export default {
    
    /**
     * Fetches only playlists and profile data, songs are deliberately left out to keep call light
     */
    fetchSession: async function(){
        await this.fetch('playlists,profile')
    },

    /**
     * fetches multiple content from server, requestedTypes is , comma-separated string
     **/
    fetch : async function(requestedTypes){
        const result = await ajax.authGet(`${appSettings.serverUrl}/v1/content/${requestedTypes}`)
        sessionSet(result.payload)
    }

}
