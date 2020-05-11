/**
 * Simplified logic for retrieving selected songs in a list. Group selection of songs is handled by Store now, not the
 * list itself. We set up the list id in store's listContext, different things can add/remove songs from that list,
 * then we retrieve/clear as needed.
 */
import Store from './../store/store'

class SelectedSongsHelper {

    /**
     * contextControl is an element, usually part of collection of elements, that has
     * - listId : the unique name of the list it belongs to
     * - song or songId : its own songId
     */
    constructor(contextControl){
        if (!contextControl.props.songId && !contextControl.props.song)
            throw 'Parent needs props.songId'

        if (!contextControl.props.listId)
            throw 'Parent needs props.listId'

        this.listId = contextControl.props.listId
        this.songId = contextControl.props.song? contextControl.props.song.id : contextControl.props.songId
    }

    /**
     * Retrieves selected ids from store listContext for whatever list the helper has been bound to
     */
    getSelectedSongIds (){
        let listContext = Store.getState().listContext[this.listId]
        return listContext && listContext.selectedSongIds.length ? listContext.selectedSongIds : [this.songId]
    }
}

class ListSelectedSongsHelper {

    /**
     * contextControl is an element, usually part of collection of elements, that has
     * - listId : the unique name of the list it belongs to
     * - song or songId : its own songId
     */
    constructor(listId){
        if (!listId)
            throw 'Parent needs props.listId'

        this.listId = listId
    }

    /**
     * Retrieves selected ids from store listContext for whatever list the helper has been bound to
     */
    getSelectedSongIds (){
        let listContext = Store.getState().listContext[this.listId]
        return listContext && listContext.selectedSongIds.length ? listContext.selectedSongIds : []
    }
}

export {
    SelectedSongsHelper,
    ListSelectedSongsHelper
}