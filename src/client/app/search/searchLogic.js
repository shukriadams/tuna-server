import songsHelper from './../songs/songsHelper'
import store from './../store/store'

let filter = function(searchFor, maxResults){
    let foundFirstStage ={},
        foundSecondStage = [],
        maxExceeded = false,
        allSongs = store.getState().session ? store.getState().session.songs : [],
        foundCount = 0,
        searchString = searchFor.toLowerCase().trim().split(' ').map(word => `(?=.*${word})`).join(''),
        reg = new RegExp(searchString, 'i') // i = case insensitive

        console.log(searchString)

    for (let song of allSongs){

        if (!`${song.name} ${song.album} ${song.artist} ${song.tags.join('')}`.match(reg))
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


