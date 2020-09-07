/**
 * Wrapper for context menu. Note : this control must always be rendered from parent. It is hidden or shown. This is
 * needed to calculate it's size in the DOM, which in turn is used to position it.
 *
 * List menu cases:
 * browser :
 *
 *
 * search results
 * - Audition
 * - Enqueue
 * - Add to playlist
 * - View in browser
 *
 * queue
 * - Remove
 * - Play
 * - View in browser
 * - Add to playlist
 *
 * in playlist
 * - remove from playlist
 * - Audition
 * - View in browser
 *
 * - Audition
 * - Add to queue
 * - Add to queue and play
 * - Play (make active in queue)
 * - Remove(from queue)
 * - Add to playlist >
 * - Remove from playlist
 * - Goto album
 * - Hide
 * - Unhide
 */
import React from 'react'
import ReactDOM from 'react-dom'
import ClassNames from 'classnames'
import ReactSVG from 'react-svg'
import vc from 'vcjs'
import { clearSelectedRows, playlistRemoveSong, closeContextMenu, loveSong, unloveSong, auditionSong, addToQueue, removeFromQueue } from './../actions/actions'
import QueueHelper from './../queue/queueHelper'
import gluActiveMediaQuery from './../glu_activeMediaQuery/index'
import flipper from './../songs/flipHelper'
import { SelectedSongsHelper } from './../songs/selectedSongsHelper'
import { View as Button } from './../glu_button/index'
import { connect } from 'react-redux'
import ajax from './../ajax/asyncAjax'
import playlistHelper from './../playlist/playlistHelper'
import { playListSetAll } from './../actions/actions'
import appSettings from './../appSettings/appSettings'

class View extends React.Component {

    constructor(props){

        super(props)

        this.state = {
            timeOpened : null,
            showPlaylists : false,
            showLoved : false,
            showAudition : false,
            showEnqueue: false,
            showRemoveFromQueue : false,
            showEnqueueAndPlay: false,
            showPlay: false,
            showRemoveFromPlaylist: false,
            showAddToPlaylist : false,
            showGotoAlbum : false
        }

        this.selectedSongsHelper = new SelectedSongsHelper(this)
    }


    componentWillMount(){
        let isInQueue = QueueHelper.isSongInQueue(this.props.songId)
        this.setState({
            timeOpened : new Date(),
            showEnqueue : this.props.context !== 'playlist' && !isInQueue,
            removeFromPlaylist : this.props.context === 'playlist',
            showRemoveFromQueue : this.props.context === 'queue',
            showAddToPlaylist : this.props.context !== 'queue' && this.props.context !== 'playlist',
            showAudition : this.props.context !== 'queue' && this.props.context !== 'playlist'
        })
    }


    componentDidMount(){
        this.setPosition()

        // need to bind event handler as class member with no "this" in it to allow us to cleanly unbind it. Else
        // even an opening click will trigger a close
        this.handleOffClick = (e)=>{
            if (vc.isDescendentOf(e.target, ReactDOM.findDOMNode(this.refs.menu)))
                return

            this.close()
        }

        this.handleWindowResize = ()=>{
            this.close()
        }

        document.addEventListener('click', this.handleOffClick)
        window.addEventListener('resize', this.handleWindowResize)
    }


    /**
     *
     */
    componentWillUnmount(){
        document.removeEventListener('click', this.handleOffClick)
        window.removeEventListener('resize', this.handleWindowResize)
    }


    /**
     * After menu opens, call this to tweak its position relative to the row it spawned over. Not needed on mobule
     * devices.
     */
    setPosition(){
        // don't force position on mobile devices, default is good enough
        if (gluActiveMediaQuery.get() === 'small')
            return

        const deadZone = 22,                // zone around menu to sens
            contextMenuBreathingSpace = 12 // gap between context menu and container when positioning menu

        let list = document.querySelector(`[data-list="${this.props.listId}"]`),
            row = list.querySelector(`[data-songid="${this.props.songId}"]`),
            relativeY = vc.offset(row).top + list.scrollTop - vc.offset(list).top + 2,   // work out position of context menu relative to row clicked icon is in ... some of these values are fudged
            position = { right : contextMenuBreathingSpace, top : relativeY }                        // note : position object is used directly as inline CSS by react

        // note that we cannot reliably get menu position using its offset, but menu is positioned relative to a row,
        // and we CAN get the row's position
        let containerOffset = vc.offset(list),
            rowOffset = vc.offset(row),
            contextMenuBottom = rowOffset.top + this.refs.menu.offsetHeight,
            contextMenuTop = rowOffset.top - list.scrollTop - contextMenuBreathingSpace,
            containerBottom = containerOffset.top + list.offsetHeight - list.scrollTop - deadZone // give some extra buffer so context menu doesn't have to get right up against it to trip

        // if bottom of menu extends beyond parent bottom, bottom align the menu instead
        if (contextMenuBottom > containerBottom) {
            // if no scroll, we're dealing with a normal list or a scrollable one that hasn't started scrolling yet.
            // stick the context menu to the bottom, give some buffer and be done with it
            position = {
                bottom: contextMenuBreathingSpace - list.scrollTop,
                right: contextMenuBreathingSpace
            }

        } else if (contextMenuTop < containerOffset.top)
            // if top of menu collides with container top, force it to render at a respectable distance
            position.top = list.scrollTop + contextMenuBreathingSpace

        this.setState({
            position: position
        })
    }


    close(){
        closeContextMenu(this.props.listId)
    }


    togglePlaylists(e){
        // ignore clicks on self
        if (vc.isDescendentOf(e.target, this.refs.playlistSubmenu))
            return

        this.setState({ showPlaylists : true })
    }

    closePlaylists(){
        this.setState({ showPlaylists : false})
    }

    enqueue(){
        let songIds = this.selectedSongsHelper.getSelectedSongIds()
        addToQueue(songIds)
        clearSelectedRows(this.props.listId)
        flipper(this.props.listId, songIds)
        this.close()
    }


    audition(){
        auditionSong(this.props.songId)
        this.close()
    }

    removeFromPlaylist(){
        playlistRemoveSong(this.props.listId, this.props.songId)
        this.close()
    }

    async addToPlaylist(){
        let playlistId = this.refs.playlists.value

        if (playlistId){
            let playlist = playlistHelper.getById(playlistId),
                songsToAdd = this.selectedSongsHelper.getSelectedSongIds(),
                originalLength = playlist.songs.length

            for (const songToAdd of songsToAdd)
                if (!playlist.songs.includes(songToAdd))
                    playlist.songs.push(songToAdd )

            if (originalLength === playlist.songs.length){
                this.close()
            } else {
                let result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, playlist)
                playListSetAll(result.payload.playlists)
                this.close()
            }

        } else {
            const newPlaylist = playlistHelper.createNew()
            newPlaylist.songs = this.selectedSongsHelper.getSelectedSongIds()
            const result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, newPlaylist)
            playListSetAll(result.payload.playlists)
            this.close()
        }
    }


    dequeue(){
        let songIds = this.selectedSongsHelper.getSelectedSongIds()
        removeFromQueue(songIds)
        clearSelectedRows(this.props.listId)
        this.close()
    }


    render(){
        let playlistClassNames = ClassNames('listContextMenu-subMenu', { 'listContextMenu-subMenu--show' : this.state.showPlaylists})
        return (
            <div className="listContextMenu" ref="menu" style={this.state.position}>
                <div className="listContextMenu-scaffold">
                    <ul>
                        <li className="listContextMenu-function listContextMenu-close" onMouseEnter={this.closePlaylists.bind(this)}>
                            <a className="listContextMenu-functionLink" onClick={this.close.bind(this)}>
                                <ReactSVG path="/media/svg/close.svg" />
                                Close
                            </a>
                        </li>
                        
                        {
                            false &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" onClick={()=>loveSong(this.props.songId)}>Love</a></li>
                        }

                        {
                            false &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" onClick={()=>unloveSong(this.props.songId)}>Unlove</a></li>
                        }

                        {
                            this.state.showAudition &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" onClick={this.audition.bind(this)}>Audition</a></li>
                        }

                        {
                            this.state.showEnqueue &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" onClick={this.enqueue.bind(this)}>Enqueue</a></li>
                        }

                        {           
                            this.state.removeFromPlaylist &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" onClick={this.removeFromPlaylist.bind(this)}>Remove</a></li>
                        }

                        {
                            /* remove from queue */
                            this.state.showRemoveFromQueue &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" onClick={this.dequeue.bind(this)} >Remove</a></li>
                        }

                        {
                            this.state.showEnqueueAndPlay &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" >Enqueue & play</a></li>
                        }

                        {
                            /* make active in queue */
                            this.state.showPlay &&
                                <li className="listContextMenu-function" onMouseEnter={this.closePlaylists.bind(this)}><a className="listContextMenu-functionLink" >Play</a></li>
                        }

                        {
                            this.state.showAddToPlaylist &&
                                <li className="listContextMenu-function" onMouseEnter={this.togglePlaylists.bind(this)} >
                                    <a className="listContextMenu-functionLink" >
                                        Add to playlist
                                        <ReactSVG path="/media/svg/left.svg" />
                                    </a>
                                    <div className={playlistClassNames} ref="playlistSubmenu">
                                        <ul className="listContextMenu-subMenuScaffold">
                                            <li className="listContextMenu-subFunction form-row">
                                                <select ref="playlists" className="form-select">
                                                    {
                                                        this.props.playlists.map((playlist, index)=>{
                                                            return (
                                                               <option key={index} value={playlist.id}>{playlist.name}</option>
                                                            )
                                                        })
                                                    }
                                                    <option value="">... new playlist</option>
                                                </select>
                                                <div>
                                                    <Button text="Add" onClick={this.addToPlaylist.bind(this)} disabledText="busy" />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                        }

                        {
                            /* from playlist */
                            this.state.showRemoveFromPlaylist &&
                                <li className="listContextMenu-function"><a className="listContextMenu-functionLink" >Remove</a></li>
                        }

                        {
                            this.showGotoAlbum &&
                                <li className="listContextMenu-function"><a className="listContextMenu-functionLink" >Goto album</a></li>
                        }
                    </ul>

                </div>
            </div>

        )
    }
}

View.defaultProps = {
    listId : null,  // list this context menu is attached to
    context : null, // same as list component
    list: null,     //
    row: null,      // list row to position menu over
    songId : null   // set to value to show menu
}

/* model : set songId to a value to show context menu, else it is hidden */
export default connect(
    (state)=>{
        return {
            playlists : state.session ? state.session.playlists : []
        }
    }
)(View)