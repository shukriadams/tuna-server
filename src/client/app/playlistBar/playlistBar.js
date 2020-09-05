import React, { Fragment } from 'react'
import playlistHelper from './../playlist/playlistHelper'
import queueHelper from './../queue/queueHelper'
import { playListSetAll, nowPlaylistsDialogShow, playlistSet, playlistUnset, playlistClean, clearQueue } from './../actions/actions'
import { connect } from 'react-redux'
import ajax from './../ajax/asyncAjax'
import appSettings from './../appSettings/appSettings'

class View extends React.Component {

    async savePlaylistChanges(){
        let playlist = playlistHelper.getById(this.props.playlistId)
        playlist.songs = queueHelper.getQueueSongs()

        const result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, playlist)
        playListSetAll(result.payload.playlists)
        playlistClean()
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
                            <span className="playlistBar-currentLiteral">Playlist :</span> <span className="playlistBar-currentPlaylistName">{ playlist.name }</span>
                            <a className="playlistBar-unloadPlaylist" onClick={this.unloadPlaylist.bind(this)}>Unload it</a>
                            {
                                this.props.isDirty &&
                                    <a className="playlistBar-updatePlaylist" onClick={this.savePlaylistChanges.bind(this)}>
                                        Save changes
                                    </a>
                            }
                        </div>
                }

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