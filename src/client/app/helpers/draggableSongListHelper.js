import DraggableListHelper from './draggableListHelper'
import { moveSongsInQueue } from './../actions/actions'

export default class extends DraggableListHelper {
    onItemsDragged(){
        let draggedSongIds = this.listContext.selectedSongIds
        if (!draggedSongIds.length)
            draggedSongIds = [this.draggedItem.getAttribute('data-songid')]
        
        moveSongsInQueue(draggedSongIds, this.indexDraggedOver)
    }
}