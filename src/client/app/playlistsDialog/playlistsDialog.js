import React, { Fragment } from 'react'
import Modal from './../modal/modal'
import { connect } from 'react-redux'
import { nowPlaylistsDialogHide, playListSetAll, playlistSet } from './../actions/actions'
import { View as Button } from './../glu_button/index'
import playlistHelper from './../playlist/playlistHelper'
import appSettings from './../appSettings/appSettings'
import Ajax from './../ajax/ajax'
import ajax from './../ajax/asyncAjax'
import { View as GluConfirmModal } from './../glu_confirmModal/index'
import { TextField } from './../form/form'
import ReactSVG from 'react-svg'

class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            editPlaylistId : null,
            isBusySaving : false,
            isBusyCreating : false,
            isMerging : false,
            expandFunctionsPlaylistId : null,
            mergePlaylistId : null,
            confirmDelete: false,
            deletingPlaylistId : null
        }
    }

    /**
     * Need to force set hide state when modal is closed from within
     */
    onModalClose(){
        nowPlaylistsDialogHide()
    }

    loadPlaylist(playlistId){
        this.setState({
            expandFunctionsPlaylistId : null
        })

        playlistSet(playlistId)
        nowPlaylistsDialogHide()
    }

    editPlaylist(playlistId){
        this.setState({
            editPlaylistId: playlistId
        })
    }

   async savePlaylist(){
        if (!this.refs.playlistName.value().length)
            return
            
        let playlist = playlistHelper.getById(this.state.editPlaylistId)
        playlist.name = this.refs.playlistName.value()

        this.setState({
            isBusySaving : true
        })

        const result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, playlist)
        this.setState({
            editPlaylistId: null,
            isBusySaving : false,
            expandFunctionsPlaylistId : null
        })

        playListSetAll(result.payload.playlists)
    }

    cancelPlaylistEdit(){
        this.setState({
            editPlaylistId: null,
            expandFunctionsPlaylistId : null,
        })
    }

    confirmDeletePlaylist(playlistId){
        let playlist = playlistHelper.getById(playlistId)

        // playlist is empty, skip confirm and got straight to delete
        if (playlist.songs.length === 0){
            this.acceptDelete(playlistId)
        } else {
            this.setState({
                deletingPlaylistId : playlistId,
                confirmDelete: true
            })
        }
    }

    async acceptDelete(playlistId){
        if (!playlistId)
            playlistId = this.state.deletingPlaylistId

        const result = await ajax.delete(`${appSettings.serverUrl}/v1/playlists/${playlistId}`)
        playListSetAll(result.payload.playlists)
        this.setState({
            deletingPlaylistId: null,
            expandFunctionsPlaylistId : null,
            confirmDelete: false
        })
    }

    rejectDelete(){
        this.setState({
            confirmDelete: false,
            deletingPlaylistId : null
        })
    }

    createPlaylist(){
        let playlist = playlistHelper.createNew()

        this.setState({
            isBusyCreating : true
        })

        new Ajax().postAuth(`${appSettings.serverUrl}/v1/playlists`, playlist, (result)=>{
            playListSetAll(result.payload.playlists);
            this.setState({
                isBusyCreating : false
            })
        })
    }

    mergePlaylistStart(playlistId){
        this.setState({
            mergePlaylistId : playlistId,
            isMerging : true
        })
    }

    cancelMerge(){
        this.setState({
            isMerging : false,
            mergePlaylistId : null
        })
    }

    toggleExpandedFunctions(playlistId){
        if (playlistId === this.state.expandFunctionsPlaylistId)
            this.setState({ expandFunctionsPlaylistId : null })
        else
            this.setState({ expandFunctionsPlaylistId : playlistId })
    }

    render(){
        let editPlaylist = null
        if (this.state.editPlaylistId)
            editPlaylist = playlistHelper.getById(this.state.editPlaylistId)

        return(
            <div className="playlistsDialog">
                <Modal title="Playlists" onClose={this.onModalClose.bind(this)} show={this.props.show} closeSVG="/media/svg/close.svg">
                    {
                        this.props.playlists.length === 0 &&
                            <div className="playlists-empty">
                                You haven't created any playlists yet.
                            </div>
                    }

                    {
                        this.props.playlists.length > 0 &&
                        <ul className="playlistsDialog-playlists">
                            {
                                this.props.playlists.map(function(playlist, index){
                                    return(
                                        <li className="playlistsDialog-playlist" key={index}>
                                            <div className="playlistsDialog-name">
                                                <span className="playlistsDialog-count">
                                                    {index + 1})
                                                </span>

                                                {
                                                    this.state.editPlaylistId !== playlist.id &&
                                                        <Fragment>
                                                            {playlist.name}
                                                            {playlist.songs.length ? ` (${playlist.songs.length} songs)` : ''}
                                                        </Fragment>
                                                }

                                                {
                                                    this.state.editPlaylistId === playlist.id &&
                                                        <Fragment>
                                                            <TextField ref="playlistName" defaultValue={editPlaylist.name} minLength="1" maxLength="25" />
                                                        </Fragment>
                                                }
                                            </div>

                                            <div className="playlistsDialog-functions">
                                                {
                                                    this.state.editPlaylistId === playlist.id &&
                                                        <Fragment>
                                                            <Button onClick={this.savePlaylist.bind(this)} isDisabled={this.state.isBusySaving} disabledText="Saving" text="Update" />
                                                            <Button onClick={this.cancelPlaylistEdit.bind(this)} text="Cancel" />
                                                        </Fragment>
                                                }

                                                {
                                                    this.state.mergePlaylistId === playlist.id &&
                                                        <Fragment>
                                                            <select ref="mergeTarget" className="form-select">
                                                            {
                                                                this.props.playlists.map((playlist, index)=>{
                                                                    return (
                                                                        <option key={index} value={playlist.id}>{playlist.name}</option>
                                                                    )
                                                                })
                                                            }
                                                            </select>
                                                            <Button onClick={this.cancelMerge.bind(this)} text="Cancel" />
                                                        </Fragment>
                                                }

                                                {
                                                    this.state.editPlaylistId !== playlist.id &&
                                                        <Fragment>

                                                            <Button onClick={this.loadPlaylist.bind(this, playlist.id)} text="Load" />

                                                            {
                                                                this.state.expandFunctionsPlaylistId === playlist.id &&
                                                                    <Fragment>
                                                                        <Button onClick={this.editPlaylist.bind(this, playlist.id)} text="Rename" />
                                                                        <Button onClick={this.mergePlaylistStart.bind(this, playlist.id)} text="Merge" />
                                                                        <Button onClick={this.confirmDeletePlaylist.bind(this, playlist.id)} text="Delete" />
                                                                    </Fragment>
                                                            }

                                                            <ReactSVG path='/media/svg/more.svg' className="playlistsDialog-toggleExpandedFunctions" onClick={this.toggleExpandedFunctions.bind(this, playlist.id)} />
                                                        </Fragment>
                                                }
                                            </div>
                                        </li>
                                    );
                                }.bind(this))
                            }
                        </ul>
                    }

                    <Button onClick={this.createPlaylist.bind(this)} disabledText="contacting server" text="New playlist" isDisabled={this.state.isBusyCreating} />
                </Modal>
                <GluConfirmModal show={this.state.confirmDelete} onAccept={this.acceptDelete.bind(this)} onReject={this.rejectDelete.bind(this)} >
                    <h2>Warning</h2>
                    <p>
                        Are you sure you want to delete this playlist?
                    </p>
                </GluConfirmModal>
            </div>
        )
    }
}

export default connect(
    (state)=>{
        return {
            playlists : state.session.playlists ? state.session.playlists : [],
            show : state.now.showPlaylistsDialog
        }
    }
)(View)
