import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import store from './../store/store';
import history from './../history/history'
import { View as Button } from './../glu_button/index'
import playlistHelper from './../playlist/playlistHelper'
import ajax from './../ajax/asyncAjax'
import appSettings from './../appSettings/appSettings'
import { playListSetAll, addToQueue, setQueue } from './../actions/actions'
import DragHelper from './../helpers/draggablePlaylistHelper'
import ListSong from './../listSong/listSong'
import ListModel from './../store/models/listContextListModel'
import { View as GluConfirmModal } from './../glu_confirmModal/index'

class View extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            changingName : false,
            promptDelete : false,
            isBusySaving : false
        }
    }

    leaveChangeName(){
        this.setState({ changingName : false })
    }

    addToQueue(){
        const playlist = playlistHelper.getById(this.props.id)
        addToQueue(playlist.songs)
    }

    overwriteQueue(){
        const playlist = playlistHelper.getById(this.props.id)
        setQueue(playlist.songs)        
    }

    async delete(){
        const result = await ajax.delete(`${appSettings.serverUrl}/v1/playlists/${this.props.id}`)
        playListSetAll(result.payload.playlists)
        this.setState({
            promptDelete: false
        })
    }

    async updateName(){
        if (!this.refs.name.value.length)
            return
            
        const playlist = playlistHelper.getById(this.props.id)
        playlist.name = this.refs.name.value

        this.setState({
            isBusySaving : true
        })

        const result = await ajax.post(`${appSettings.serverUrl}/v1/playlists`, playlist)
        playListSetAll(result.payload.playlists)

        this.setState({ 
            changingName : false, 
            isBusySaving : false
         })
    }
    
    componentDidMount(){
        if (this.refs.list)
            this.dragHelper = new DragHelper(this.refs.list, this.props.id, 'listSong', 'data-songid')
    }

    render(){
        // get this menu's redux state, else use a blank state model from Store
        let listContextModel = this.props.listContext[this.props.id] ?
            this.props.listContext[this.props.id] :
            Object.assign({}, ListModel)

        const songsInPlaylist = [],
            allSongs = store.getState().session.songs

        // handle no playlist found
        if (!this.props.playlist){
            return (
                <div>
                    Playlist not found
                </div>)
        }

        // get array of songs on playlist
        for (const songId of this.props.playlist.songs){
            const song = allSongs.find(song => song.id === songId)
            if (!song)
                continue

                songsInPlaylist.push(song)
        }

        return (
            <div className="playlist">
                
                <GluConfirmModal show={this.state.promptDelete} onAccept={this.delete.bind(this)} onReject={()=> this.setState({ promptDelete : false })}>
                    Are you sure your want to delete the playlist <strong>{this.props.playlist.name}</strong>?
                </GluConfirmModal>

                <div>
                    {
                        !this.state.changingName &&
                        <div className="playlist-headerContainer" onClick={()=> this.setState({ changingName : true }) }>
                            <h1 className="playlist-header">{this.props.playlist.name}</h1>
                            <a className="playlist-renameEnter" >
                                Rename
                            </a>
                        </div>
                    }

                    {
                        this.state.changingName &&
                        <div className="playlist-headerContainer">
                            <input className="playlist-headerEdit" ref="name" defaultValue={this.props.playlist.name} type="text" />
                            <a className="playlist-headerSave" onClick={this.updateName.bind(this)}>Save</a>
                            <a className="playlist-headerCancel" onClick={()=> this.setState({ changingName : false }) }>Cancel</a>
                        </div>
                    }

                    <div>
                        <Link to="/playlists">Back to all playlists</Link>
                    </div>

                    {
                        !songsInPlaylist.length &&
                            <div>
                                This in playlist is empty - add some songs to it
                            </div>
                    }

                    {
                        !!songsInPlaylist.length &&
                        <Fragment>

                            <ul ref="list" className="playlist" data-list={this.props.id}>
                                {
                                    songsInPlaylist.map((song, index) => (
                                        <ListSong
                                            key={index}
                                            song={song}
                                            showMainFunction={false}
                                            draggedOver={listContextModel.draggedOverSongId === song.id}
                                            isScrollingPastCurrent={listContextModel.isScrollingPastCurrent}
                                            isSelected={listContextModel.selectedSongIds.includes(song.id)}
                                            context="playlist"
                                            rowNumber={index + 1}
                                            listId={this.props.id} />
                                        ))
                                }
                            </ul>

                            <div className="playlist-functions">
                                <Button text="Add to queue" onClick={this.addToQueue.bind(this)} />
                                <Button text="Overwrite queue" onClick={this.overwriteQueue.bind(this)}  />
                            </div>

                        </Fragment>
                    }
                    <div>
                        <h2>Dangerzone</h2>
                        <Button text="Delete playlist" onClick={()=>{ console.log("lol") ; this.setState({ promptDelete : true }) }} />
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(
    (state, props)=>{
        return {
            listContext : state.listContext,
            playlist : state.session.playlists.find(playlist => playlist.id === props.id) 
        }
    }
)(View)

