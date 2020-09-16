import DraggableListHelper from './draggableListHelper'
import { playListSetAll } from './../actions/actions'
import store from './../store/store'
import ajax from './../ajax/asyncAjax'
import appSettings from './../appSettings/appSettings'

export default class extends DraggableListHelper {
    async onItemsDragged(){
        let draggedSongIds = this.listContext.selectedSongIds
        if (!draggedSongIds.length)
            draggedSongIds = [this.draggedItem.getAttribute('data-songid')]
        
        // get playlist
        const playlist = store.getState().session.playlists.find(playlist => playlist.id === this.listId)

        // move selected items to index in array
        let songs = playlist.songs.slice(0)
        let insertPosition = this.indexDraggedOver + 1
        for (const draggedSongId of draggedSongIds){
            const position = songs.indexOf(draggedSongId),
                item = songs.splice(position, 1)[0]

            // add song back to list at new position
            songs.splice(insertPosition, 0, item)
            insertPosition ++
        }

        playlist.songs = songs

        // submit
        const result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, playlist)
        playListSetAll(result.payload.playlists)
        // set playlists payload
        //console.log(draggedSongIds, this.indexDraggedOver)
    }
}