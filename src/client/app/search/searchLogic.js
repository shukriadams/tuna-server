import songsHelper from './../songs/songsHelper'
import store from './../store/store'

let filter = function(searchFor, maxResults){
    let foundFirstStage ={},
        foundSecondStage = [],
        maxExceeded = false,
        allSongs = store.getState().session ? store.getState().session.songs : [],
        foundCount = 0,
        searchString = searchFor.trim()

    for (let song of allSongs){

        let match = false,
            reg = new RegExp(searchString, 'i') // i = case insensitive

        if (song.name.match(reg))
            match = true

        if (song.album.match(reg))
            match = true

        if (song.artist.match(reg))
            match = true

        if (!match)
            continue

        if (!foundFirstStage[song.id]){
            foundFirstStage[song.id] = {
                song : song,
                weight: 0
            }

            foundCount = foundCount + 1
        }

        foundFirstStage[song.id].weight = foundFirstStage[song.id].weight + 1

        if (foundCount > maxResults){
            maxExceeded = true
            break
        }
    }



    // convert to array
    for (let p in foundFirstStage)
        foundSecondStage.push(foundFirstStage[p].song)

    foundSecondStage = foundSecondStage.slice(0,maxResults)
    foundSecondStage.sort(songsHelper.sort)

    return {
        songs : foundSecondStage,
        maxExceeded: maxExceeded
    }
}

export { filter }


