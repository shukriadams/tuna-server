/**
 * NO LONGE RUSED
 * Contains logic for handling multiselect on song lists, including key behaviour.
 *
 * ASSUMPTIONS :
 * - Works on "song" dom elements. A song must have a data-songId attribute with songId.
 * - Song rows are first-level children in a parent container, and multiselect can chain children together.
 * - reactjs container calling this has a .state property called selectedSongs which is an array. if a songid is in this array,
 *   the react view will render it as selected.
 * - this helper will trigger state updates on the react view bound to it.
 *
 */

import { shiftKey, ctrlKey } from './../keywatchers/keyWatchers'

class SongListSelectHelper {

    /**
     *
     */
    constructor(listId, onChanged){
        this.lastFocusedSongId = null
        this.viewRootNode = document.querySelector(`[data-list="${listId}"]`)
        this.onChanged = onChanged
        this.selectedSongIds = [ ]
    }

    /**
     * Use this to update selected songs collection, it will also fire events etc
     */
    _setSelectedSongs(songIds){
        const previousSongIds = this.selectedSongIds.slice(0)
        this.selectedSongIds = songIds

        if (this.onChanged)
            this.onChanged(this.selectedSongIds, previousSongIds)
    }


    /**
     * Call this when a row is clicked
     */
    handleRowClickEvent(songRow){
        const songId = songRow.attributes['data-songid'].value

        // if set same song, unset
        if (this.lastFocusedSongId === songId){
            this.lastFocusedSongId = null
            return this._setSelectedSongs([])
        }

        // control key down, additive selection is happening
        if (ctrlKey.isDown){
            let selected = this.selectedSongIds.slice(0), //clone existing array
                songPosition = selected.indexOf(songId)

            if (songPosition === -1)
                selected.push(songId)
            else
                selected.splice(songPosition, 1)

            return this._setSelectedSongs(selected)
        }

        // clicked on a song other than focused song, multiselect is happening
        if (shiftKey.isDown && this.lastFocusedSongId){
            let currentSelectedItem = this.viewRootNode.querySelector('[data-songid="' + this.lastFocusedSongId + '"]'),
                currentSelectedItemIndex = currentSelectedItem.index(),
                otherSelectedItem = this.viewRootNode.querySelector('[data-songid="' + songId + '"]'),
                otherSelectedItemIndex = otherSelectedItem.index(),
                lookIndex = currentSelectedItemIndex < otherSelectedItemIndex ? currentSelectedItemIndex : otherSelectedItemIndex,
                endId = currentSelectedItemIndex > otherSelectedItemIndex ? this.lastFocusedSongId : songId,
                selectedSongIds = []

            // find all children between last selected row and currently selected row, add them to selected array
            let children = this.viewRootNode.childNodes
            lookIndex--

            while(lookIndex < children.length){
                lookIndex ++
                let row = children[lookIndex],
                    thisRowSongId = row.getAttribute('data-songid')

                if (!thisRowSongId)
                    continue

                selectedSongIds.push(thisRowSongId)
                if (thisRowSongId === endId)
                    break
            }

            return this._setSelectedSongs(selectedSongIds)
        }

        // fallthrough behaviour - focus the current selected song
        this.lastFocusedSongId = songId
        this._setSelectedSongs([songId])
    }


    /**
     * Returns an array of rows matching the song ids.
     */
    selectRows(songIds){

        let rows = [],
            songRows = this.viewRootNode.querySelectorAll('[data-songid]')

        for (let songRow of songRows)
            if (songIds.includes(songRow.attributes['data-songid'].value))
                rows.push(songRow)

        return rows
    }
}

/**
 * Gets an array of song ids of selected siblings of the parent row element.
 * Standalone function.
 *
 * Invoke using a row dom element, works on sibling rows under the call row's parent.
 */
function selectedIdsFromDom(row){
    let siblings = row.parentElement.childNodes,
        songIds = []

    for (let s of siblings)
        if (s.classList.contains('listSong--selected'))
            songIds.push(s.getAttribute('data-songid'))

    return songIds
}

export { SongListSelectHelper, selectedIdsFromDom  }