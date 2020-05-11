import React, { Fragment } from 'react'
import playlistHelper from './../playlist/playlistHelper'
import queueHelper from './../queue/queueHelper'
import PlaylistsDialog from './../playlistsDialog/playlistsDialog'
import { playListSetAll, nowPlaylistsDialogShow, playlistSet, playlistUnset, playlistClean, clearQueue } from './../actions/actions'
import { connect } from 'react-redux'
import Ajax from './../ajax/ajax'
import appSettings from './../appSettings/appSettings'

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isBusyCreating : false,
        }
    }

    openPlaylistsDialog(){
        nowPlaylistsDialogShow()
    }

    savePlaylistChanges(){
        let playlist = playlistHelper.getById(this.props.playlistId)
        playlist.songs = queueHelper.getQueueSongs()

        new Ajax().postAuth(`${appSettings.serverUrl}/v1/playlists`, playlist, (result)=>{
            playListSetAll(result.payload.playlists)
            playlistClean()
        })
    }

    /**
     *
     */
    unloadPlaylist(){
        if (this.props.isDirty && !confirm('Lose unsaved changes to playlist?'))
            return

        playlistUnset()
        clearQueue()
    }

    playlistFromQueue(){
        let playlist = playlistHelper.createNew()
        playlist.songs = queueHelper.getQueueSongs()

        this.setState({
            isBusyCreating : true
        })

        new Ajax().postAuth(`${appSettings.serverUrl}/v1/playlists`, playlist, (result)=>{

            this.setState({
                isBusyCreating : false
            })

            playListSetAll(result.payload.playlists)
            playlistSet(result.payload.playlist.id)
        })
    }

    /**
     *
     */
    clearQueue(){
        clearQueue()
    }

    /**
     *
     */
    render(){
        let playlist = null,
            queueSize = queueHelper.getQueueSongs().length

        if (this.props.playlistId)
            playlist = playlistHelper.getById(this.props.playlistId)

        return(
            <div className="playlistBar">

                {
                    playlist &&
                        <div className="playlistBar-currentPlaylist">
                            <span className="playlistBar-currentLiteral">Current playlist :</span> <span className="playlistBar-currentPlaylistName">{ playlist.name }</span>
                            <a className="playlistBar-unloadPlaylist" onClick={this.unloadPlaylist.bind(this)}>Unload it</a>
                            {
                                this.props.isDirty &&
                                    <a className="playlistBar-updatePlaylist" onClick={this.savePlaylistChanges.bind(this)}>
                                        Save changes
                                    </a>
                            }
                        </div>
                }

                {
                    !playlist && queueSize > 0 &&
                        <div className="playlistBar-currentPlaylist">
                            {
                                this.state.isBusyCreating &&
                                    <Fragment>
                                        Creating playlist ...
                                    </Fragment>
                            }

                            {
                                !this.state.isBusyCreating &&
                                    <a className="playlistBar-new" onClick={this.playlistFromQueue.bind(this)} >
                                        {queueSize} queued songs - Add to new playlist 
                                    </a>
                            }

                        </div>

                }

                <div className="playlistBar-playlistsContainer">
                    <a onClick={this.openPlaylistsDialog.bind(this)} className="playlistBar-openListsDialog">Playlists</a>
                </div>

                <PlaylistsDialog />
            </div>
        )
    }
}

export default connect(
    (state)=>{
        return {
            queue : state.queue,
            playlistId : state.playlist.playlistId,
            isDirty : state.playlist.isDirty,
            playlists : state.session.playlists
        }
    }
)(View)