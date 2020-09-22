/**
 * Controls the visual "vertical flip" behavior of song list items when adding them to queue
 */
export default (listId, songIdsToFlip)=>{
    
    const list = document.querySelector(`[data-list="${listId}"]`),
        persist = 800,
        offset = 100

    for (let i = 0 ; i < songIdsToFlip.length ; i ++){

        let songId = songIdsToFlip[i],
            songRow = list.querySelector(`[data-songid="${songId}"]`); // FFS DO NOT REMOVE THIS SEMICOLON!

        ((songRow, i)=>{
            setTimeout(()=>{
                songRow.classList.add('listSong--flipped')

                setTimeout(()=>{
                    songRow.classList.remove('listSong--flipped')
                }, persist)

            }, i * offset)
        })(songRow, i)

    }
}
