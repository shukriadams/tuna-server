import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import ListSong from './../listSong/listSong'
import { View as ListAlbum } from './../listAlbum/listAlbum'
import  ContextMenu from './../listContextMenu/listContextMenu'
import vc from 'vcjs'
import DragHelper from './../helpers/draggableSongListHelper'
import ListModel from './../store/models/listContextListModel'
import queueHelper from './../queue/queueHelper'
import playHelper from './../player/playerHelper'
import { removeFromQueue, clearSelectedRows } from './../actions/actions'
import pguid  from 'pguid'
import KeyWatcher from './../keyWatcher/index'
import { ListSelectedSongsHelper } from './../songs/selectedSongsHelper'

class View extends React.Component {

    componentDidMount(){
        if (this.props.context === 'queue')
            this.dragHelper = new DragHelper(this.refs.list, this.props.id, 'listSong', 'data-songid')

        // need to bind event handler as class member with no "this" in it to allow us to cleanly unbind it. Else
        // even an opening click will trigger a close
        this.handleOffClick = (e)=>{
            if (vc.isDescendentOf(e.target, ReactDOM.findDOMNode(this.refs.list)))
                return

            if (vc.isDescendentOf(e.target, 'listContextMenu'))
                return

            clearSelectedRows(this.props.id)
        }

        document.addEventListener('click', this.handleOffClick)

        this.selectedSongsHelper = new ListSelectedSongsHelper(this.props.id)

        this.delKey = new KeyWatcher({
            key : 'Delete',
            onDown : ()=>{
                let songIds = this.selectedSongsHelper.getSelectedSongIds()
                removeFromQueue(songIds)
                clearSelectedRows(this.props.listId)
            }
        })
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleOffClick)
        if (this.dragHelper)
            this.dragHelper.dispose()

        this.delKey.dispose()
    }

    render(){
        // get this menu's redux state, else use a blank state model from Store
        let listContextModel = this.props.listContext[this.props.id] ?
            this.props.listContext[this.props.id] :
            Object.assign({}, ListModel)

        let listClassNames = classnames('list', { 'list--scrollable' : this.props.isScrollable })

        // clone the source array
        let rowData = this.props.items.slice(0)

        // in browser mode, group songs by album, this might not be necessary
        if(this.props.context === 'browser'){
            rowData.sort(function(song1, song2){
                return song1.album > song2.album ? 1 :
                    song1.album < song2.album ? -1 :
                    0;
            })
        }

        let album = '',
            rowNumber = 1,
            index = 0

        // insert album header info
        while (index < rowData.length){
            let item = rowData[index]

            if(this.props.context === 'browser' && item.album && item.album !== album){
                // album has changed, insert an album header data item
                album = item.album
                rowNumber = 1
                rowData.splice(index, 0, { type: 'albumHeader', text : album})
                index ++ // shift index up 1 to ignore having to process albumheader on next loop pass
            }

            item.rowNumber = rowNumber

            rowNumber ++
            index ++
        }


        // put into variable for brevity
        const selectedRowIds = listContextModel.selectedSongIds,
            contextMenu = listContextModel.contextMenu


        return (
            <div className={listClassNames}>
                <ul className="list-list" ref="list" data-list={this.props.id}>
                    {
                        rowData.map((item, index) => {
                            let tags = [],
                                isCurrentSong = queueHelper.isCurrentSong(item.id);

                            if (queueHelper.isSongInQueue(item.id) && this.props.context !== 'queue')
                                tags.push('InQueue');

                            if (isCurrentSong && this.props.isPlaying)
                                tags.push('Playing');

                            if (item.type === 'albumHeader')
                                return (
                                    <ListAlbum key={index} text={item.text} />
                                );
                            else {
                                return(
                                    <ListSong
                                        key={index}
                                        song={item}
                                        tags={tags}
                                        draggedOver={listContextModel.draggedOverSongId === item.id}
                                        isCurrentSong={isCurrentSong}
                                        isScrollingPastCurrent={listContextModel.isScrollingPastCurrent}
                                        isSelected={selectedRowIds.includes(item.id)}
                                        context={this.props.context}
                                        listId={this.props.id}
                                        rowNumber={item.rowNumber}  />
                                )
                            }
                        })
                    }
                </ul>

                {
                    // force key so a menu for a different song can immediately replace an existing menu
                    contextMenu &&
                        <ContextMenu key={contextMenu.songId} context={this.props.context} listId={this.props.id} songId={contextMenu.songId} />
                }

            </div>
        )
    }
}


let Model = class {

    /**
     * @param {*} listId Initialize with random listId if id is not specified
     */
    constructor(listId = pguid()){

        // if true, list will assume the height of its parent container and be vertically scrollable within itself. Parent
        // must have position relative and its own height.
        this.isScrollable = false

        // Array of rowModel objects below
        this.items = []

        // if true, items in list can be dragged around
        this.sortable = false

        // The purpose of the list. Allowed values : 'queue', 'browser', 'search', 'playlist'
        this.context = 'browser'

        this.id = listId
    }

}


View.defaultProps = new Model()

// redux mapping
View = connect(
    (state) => {
        return {
            listContext : state.listContext,
            isPlaying : playHelper.isMusicPlayingNow(state.playing)
        }
    }
)(View)

export { View, Model }