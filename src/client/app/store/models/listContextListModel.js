let ListModel = {
    // ContextMenuModel. if instanced, triggers a context menu over the row, with the given songid. set to null to close menu
    contextMenu : null,
    lastFocusedSongId : null,
    draggedOverSongId : null,
    selectedSongIds : []
}

export default ListModel