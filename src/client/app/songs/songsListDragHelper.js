/**
 * Applies drag behaviour to a list of songs.
 *
 * Assumes the usual :
 */
import vc from 'vcjs'
import store from './../store/store'
import { moveSongsInQueue, setDraggedOverItem, clearDraggedOverItem ,clearSelectedRows } from './../actions/actions'
import debounce from 'debounce'

export default class SongsListDragHelper{

    constructor(draggableList, listId){

        this.pendingDraggedItem = null
        this.startDragPosition = null
        this.mousePosition = null
        this.dragThreshold = 10
        this.listId = listId

        // if dragging, the item being dragged over
        this.hoveredOver = null

        this.mouseMoveDelegate = debounce( (e)=>{
            this.mouseMove(e)
        }, 10)

        this.viewRootNode = draggableList
        this.viewRootNode.addEventListener('mousedown', this.mouseDown.bind(this), false)
        this.viewRootNode.addEventListener('mousemove', this.mouseMoveDelegate, false)
        this.viewRootNode.addEventListener('mouseup', this.mouseUp.bind(this), false)
        this.viewRootNode.addEventListener('mouseover', this.mouseOver.bind(this), false)
    }

    dispose(){
        this.viewRootNode.removeEventListener('mousedown', this.mouseDown.bind(this), false)
        this.viewRootNode.removeEventListener('mousemove', this.mouseMoveDelegate, false)
        this.viewRootNode.removeEventListener('mouseup', this.mouseUp.bind(this), false)
        this.viewRootNode.removeEventListener('mouseover', this.mouseOver.bind(this), false)
    }

    mouseOver(e){
        if (!this.draggedItem){
            e.stopPropagation()
            return
        }

        let hoverOverSongRow = vc.closest(e.target, 'listSong')
        if (hoverOverSongRow){
            if (this.draggedItem === hoverOverSongRow){
                // do nothing, the item is dragging over itself, happens at start of drag
                if (this.hoveredOver)
                    clearDraggedOverItem(this.listId)

                this.hoveredOver = null
            }
            else if (this.hoveredOver !== hoverOverSongRow)
                this.hoveredOver = hoverOverSongRow

            e.stopPropagation()
        }
    }

    /* returns true if the item being dragged is past the middle of the item being dragged over */
    isScrollingPast(e){
        if (!this.hoveredOver)
            return false

        let xPos = e.pageY - vc.offset(this.hoveredOver).top,
            percent = Math.round((xPos / this.hoveredOver.offsetHeight ) * 100)

        return percent < 50
    }

    mouseUp (e){
        // instantly clear temp drag stuff when mouse is released, no questions asked
        this.startDragPosition = null
        this.pendingDraggedItem = null

        if (!this.draggedItem){
            e.stopPropagation()
            return
        }

        if (this.hoveredOver === null){
            e.stopPropagation()
            this.clearDrag()
            return
        }

        // handle drag release here
        let isScrollingPastCurrent = this.isScrollingPast(e)
        let targetIndex = vc.index(this.hoveredOver)
        if (!isScrollingPastCurrent)
            targetIndex ++ // we want to drop it AFTER the hovered item

        // first try to move selected songs. if no songs selected, move the currently dragged row from this drag helper
        let listContext = store.getState().listContext[this.listId]

        if (listContext){
            let draggedSongIds = listContext.selectedSongIds
            if (!draggedSongIds.length)
                draggedSongIds = [this.draggedItem.getAttribute('data-songid')]
            
            moveSongsInQueue(draggedSongIds, targetIndex)
            clearSelectedRows(this.listId)
        }

        this.clearDrag()
    }

    mouseMove (e){
        this.mousePosition = { x : e.pageX, y : e.pageY }

        if (this.hoveredOver)
            setDraggedOverItem(this.listId, this.hoveredOver.getAttribute('data-songid'), this.isScrollingPast(e))

        if (this.startDragPosition && (
            Math.abs(this.startDragPosition.x - this.mousePosition.x) > this.dragThreshold ||
            Math.abs(this.startDragPosition.y - this.mousePosition.y) > this.dragThreshold))
        {
            // officially a dragged item
            this.draggedItem = this.pendingDraggedItem

            // clear temp stuff, we don't need this anymore
            this.startDragPosition = null
            this.pendingDraggedItem = null
        }
    }

    mouseDown (e){
        if (!this.mousePosition)
            return
            
        // use find parent to check if mouse was down on songrow
        let mousedownSongRow = vc.closestWithAttribute(e.target, 'data-songid')

        if (mousedownSongRow) {
            // drag may have started
            this.pendingDraggedItem = mousedownSongRow
            this.startDragPosition =  {
                x : this.mousePosition.x,
                y : this.mousePosition.y
            }

            e.stopPropagation()
        }
    }

    /**
     * cleans up drag
     **/
    clearDrag() {
        clearDraggedOverItem(this.listId)
        this.draggedItem = null
        this.hoveredOver = null
    }

}