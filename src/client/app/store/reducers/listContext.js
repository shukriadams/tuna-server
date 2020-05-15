/**
 * List context is used for communication between elements in a song list. Song lists are complex groupings of elements
 * consisting of a parent list, rows, context menus on rows, drag events, group selection of rows, and actions upon
 * groups of rows, triggered from context menus. Instead of linking all these elements together so they directly communicate
 * (bad: tight coupling), we route all communication through this reducer.
 *
 * List context lets us have multiple instances of a list at one time - song browser, queue, playlist, and search results.
 * Each instance communicates within itself.
 *
 */
import { LISTCONTEXT_SETDRAGGEDOVERITEM, LISTCONTEXT_CLEARDRAGGEDOVERITEM, LISTCONTEXT_CLEAR_SELECTION, LISTCONTEXT_OPEN_CONTEXT_MENU, LISTCONTEXT_CLOSE_CONTEXT_MENU, LISTCONTEXT_ROW_CLICKED } from './../../constants/constants'
import {ctrlKey, shiftKey} from './../../keywatchers/keyWatchers'
import ListModel from './../models/listContextListModel'
import vc from 'vcjs'

// hash table for list ids
let defaultState = { }

function playerReducer(state = defaultState, action) {
    switch (action.type) {

        case LISTCONTEXT_SETDRAGGEDOVERITEM : {
            let newState = Object.assign( { }, state)
            newState[action.listId] = newState[action.listId] || Object.assign( { }, ListModel)
            newState[action.listId].draggedOverSongId = action.songId
            newState[action.listId].isScrollingPastCurrent = action.isScrollingPastCurrent
            return newState
        }

        case LISTCONTEXT_CLEARDRAGGEDOVERITEM: {
            let newState = Object.assign( { }, state)
            newState[action.listId] = newState[action.listId] || Object.assign( { }, ListModel)
            newState[action.listId].draggedOverSongId = null
            newState[action.listId].isScrollingPastCurrent = null
            return newState
        }

        case LISTCONTEXT_OPEN_CONTEXT_MENU : {
            let newState = Object.assign( { }, state)
            newState[action.listId] = newState[action.listId] || Object.assign( { }, ListModel)
            newState[action.listId].contextMenu = { rowIndex : action.rowIndex, songId : action.songId }
            return newState
        }

        case LISTCONTEXT_ROW_CLICKED : {
            let newState = Object.assign( { }, state)
            newState[action.listId] = newState[action.listId] || Object.assign( { }, ListModel)
            let context = newState[action.listId]

            const songId = action.row.attributes['data-songid'].value

            // if clicked the same song that is current focus, unselect that song
            if (context.lastFocusedSongId === songId){
                context.lastFocusedSongId = null
                context.selectedSongIds = []
                return newState
            }

            // control key down, additive selection is happening
            if (ctrlKey.isDown){
                let selected = context.selectedSongIds.slice(0), //clone existing array
                    songPosition = selected.indexOf(songId)

                if (songPosition === -1)
                    selected.push(songId)
                else
                    selected.splice(songPosition, 1)

                context.lastFocusedSongId = songId
                context.selectedSongIds = selected
                return newState
            }

            // clicked on a song other than focused song, multiselect is happening
            if (shiftKey.isDown && context.lastFocusedSongId){
                let list = document.querySelector(`[data-list="${action.listId}"]`),
                    currentSelectedItem = list.querySelector(`[data-songid="${context.lastFocusedSongId}"]`),
                    currentSelectedItemIndex = vc.index(currentSelectedItem), 
                    otherSelectedItem = list.querySelector(`[data-songid="${songId}"]`),
                    otherSelectedItemIndex = vc.index(otherSelectedItem),
                    lookIndex = currentSelectedItemIndex < otherSelectedItemIndex ? currentSelectedItemIndex : otherSelectedItemIndex,
                    endId = currentSelectedItemIndex > otherSelectedItemIndex ? context.lastFocusedSongId : songId,
                    selectedSongIds = []

                // find all children between last selected row and currently selected row, add them to selected array
                lookIndex--

                while(lookIndex < list.children.length){
                    lookIndex ++
                    let row = list.children[lookIndex],
                        thisRowSongId = row.getAttribute('data-songid')

                    if (!thisRowSongId)
                        continue

                    selectedSongIds.push(thisRowSongId)

                    if (thisRowSongId === endId)
                        break
                }

                context.lastFocusedSongId = songId
                context.selectedSongIds = selectedSongIds
                return newState
            }

            // default single click selection
            context.lastFocusedSongId = songId
            context.selectedSongIds = [songId]
            return newState
        }

        case LISTCONTEXT_CLOSE_CONTEXT_MENU : {
            let newState = Object.assign( { }, state)
            newState[action.listId] = newState[action.listId] || Object.assign( { }, ListModel)
            newState[action.listId].contextMenu = null
            return newState
        }

        case LISTCONTEXT_CLEAR_SELECTION : {
            let newState = Object.assign( { }, state)
            newState[action.listId] = newState[action.listId] || Object.assign( { }, ListModel)
            newState[action.listId].selectedSongIds = []
            return newState
        }

        default:{
            return state
        }

    }
}

export default playerReducer