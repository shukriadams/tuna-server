import appSettings from './../appSettings/appSettings'
import ajax from './../ajax/asyncAjax'
import { sessionSet, sessionAddSongs, sessionSetSongs } from './../actions/actions'
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
        const result = await ajax.authGet(`${appSettings.serverUrl}/v1/content/all/${requestedTypes}`)
        if (result)
            sessionSet(result.payload)
    },


    fetchSongs : async function(){
        let calls = 0
        while (calls < 30){ // set max calls to prevent runaway
            let page = await ajax.authGet(`${appSettings.serverUrl}/v1/content/songs?page=${calls}`)
            if (page && page.payload){
                if (call === 0)
                    sessionSetSongs(page.payload.songs)
                else
                    sessionAddSongs(page.payload.songs)

                if (page.payload.isEnd)
                    break
            }

            calls ++
        }
    }

}
