/**
 * Presents a song on list.
 */
import React, { Fragment } from 'react'
import classnames from 'classnames'
import { clearSelectedRows, rowClicked, openContextMenu, addToQueue, focusSongInQueue, playStart } from './../actions/actions'
import { connect } from 'react-redux'
import flipper from './../songs/flipHelper'
import { SelectedSongsHelper } from './../songs/selectedSongsHelper'

class View extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            flipped : false,
            showContextMenu: false,
            functionInteractive : true
        }

        this.selectedSongsHelper = new SelectedSongsHelper(this)
    }

    mainFunctionClicked(){
        if (this.props.context === 'queue'){
            focusSongInQueue(this.props.song.id)
            playStart()
        }

        if (this.props.context === 'browser' || this.props.context === 'search'){
            let songIds = this.selectedSongsHelper.getSelectedSongIds()
            addToQueue(songIds)
            clearSelectedRows(this.props.listId)
            flipper(this.props.listId, songIds)
        }
    }

    /**
     *
     */
    onDoubleClick(){
        if (this.props.context === 'queue'){
            focusSongInQueue(this.props.song.id)
            playStart()
        }
    }

    /**
     *
     */
    onClick(e){
        rowClicked(this.props.listId, this.refs.self)
    }

    openContextMenu(){
        openContextMenu(this.props.listId, this.props.song.id )
    }

    render(){
        // ###################################################################
        // set various things based on song state, this should probably be optimized
        let showMainFunction = this.props.context !== 'queue',
            functionInteractive = true

        if (this.props.context === 'queue')
            functionInteractive = false
        
        // ###################################################################
        let flipText = this.props.context === 'browser' || this.props.context === 'search' ? 'Added' : 'Removed'

        let classNames = classnames('listSong', {
                'listSong--active' : this.props.isCurrentSong,
                'listSong--flipped' : this.state.flipped,
                'listSong--selected' : this.props.isSelected,
                'listSong--draggedUnder' : this.props.draggedOver && !this.props.isScrollingPastCurrent,
                'listSong--draggedPast' : this.props.draggedOver && this.props.isScrollingPastCurrent
            }),
            functionClassNames = classnames('listSong-function', { 'listSong-function--interactive' : functionInteractive })

        return (
            <Fragment>
                <li className={classNames} data-songid={this.props.song.id} data-fliptext={flipText} onDoubleClick={this.onDoubleClick.bind(this)} ref="self">

                    {
                        /*
                            Function is the main thing you can "do" with a row, and is always first. It will be
                            "add" on a list which can add items to the queue, and "remove" on the queue itself.

                            this should be an anchor, but we want to disable pointer cursor on some states, which anchor doesn't allow
                        */
                        showMainFunction &&
                            <div className={functionClassNames} onClick={this.mainFunctionClicked.bind(this)}>
                                <span className="listSong-functionIcon">+</span>
                            </div>
                    }

                    {/*
                        Number of the song in the list being displayed. This can be replaced with a
                        "playing" icon if the song is currently being played.
                    */}
                    <div className="listSong-lead">
                        {this.props.rowNumber}
                    </div>

                    {/* this is generic clickable row part */}
                    <div className="listSong-dynamicContent" onClick={this.onClick.bind(this)}>
                        <div className="listSong-titleWrapper">
                            <span className="listSong-song">{this.props.song.name}</span>

                            {
                                // artist name isn't necessary in browser mode
                                this.props.context !== 'browser' &&
                                    <span className="listSong-artist">{this.props.song.artist}</span>
                            }

                            {
                                // album is displayed for search results only
                                this.props.context === 'search' &&
                                    <span className="listSong-album">({this.props.song.album})</span>
                            }
                        </div>
                        {/* tags are in dynamic content because it has to wrap underneath song name on mobile*/}
                        <ul className="listSong-tags">
                            {
                                this.props.tags.map(function(tag, index){
                                    return(<li key={index} className={`listSong-tag${tag}`}></li>);
                                }.bind(this))
                            }
                        </ul>
                    </div>

                    <div className="listSong-more">
                        {
                            // do not more icon on the row which has a context menu open
                            this.props.song.id !== this.state.contextMenuSongId &&
                                <div className="listSong-moreIcon" onClick={this.openContextMenu.bind(this)}>
                                    ...
                                </div>
                        }
                    </div>
                </li>

            </Fragment>
        )
    }
}

let Model = {

    // lead number on row. Can be empty. This is NOT an id, it's a dumb string.
    rowNumber: '1',

    // must be a Song object type
    song: null,

    // id of parent list parent
    listId : null,

    isSelected: false,

    // tag elements, must coincide with css class in tag list
    tags : [],

    isCurrentSong : false,

    draggedOver : false,

    //
    isScrollingPastCurrent: false,

    // context is straight from parent list. queue|search etc, tells us what the list being used for, which influences row behavior
    context : null
}


View.defaultProps = Model

// redux mapping
export default connect(
    function (state) {
        return {
            queue : state.queue,
            //playing : state.playing // PERFORMANCE KILLER!!
        }
    }
)(View)
