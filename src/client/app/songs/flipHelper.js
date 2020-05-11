let flip = function(listId, songIdsToFlip){
    
    let list = document.querySelector(`[data-list="${listId}"]`),
        persist = 800,
        offset = 100

    for (let i = 0 ; i < songIdsToFlip.length ; i ++){

        let songId = songIdsToFlip[i],
            songRow = list.querySelector(`[data-songid="${songId}"]`)

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

export default flip