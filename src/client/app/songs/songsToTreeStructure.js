import songsHelper from './songsHelper'

export default class SongsToTreeStructure {

    constructor(songs){

        this.artistsArray = []
        this.artistLettersArray = []
        this.letters = {}
        this.artistsHash = {}
        this.albumsArray = []

        this.songs = songs


        // build a list of unique artist names by traversing all songs
        for (let s in this.songs) {
            let song = this.songs[s]
            let artist = song.artist.toLowerCase()

            if (!this.artistsHash[artist])
                this.artistsHash[artist] = {
                    name : song.artist,
                    albums : []
                }
        }

        // add albums to artists by album object,
        // also, add all songs in all albums to a single "songs" array per artist
        let albums = this._albums()

        for (let album of albums){
            this.artistsHash[album.artist.toLowerCase()].songs = this.artistsHash[album.artist.toLowerCase()].songs || []
            for (let song of album.songs)
                this.artistsHash[album.artist.toLowerCase()].songs.push(song)

            this.artistsHash[album.artist.toLowerCase()].albums.push(album)
        }

        // to array, use this stage to filter out artists with no albums, as well as build a list
        // of unique first letters for artists
        for (let artist in this.artistsHash){
            let a = this.artistsHash[artist]
            if (a.albums.length === 0)
                continue

            let letter = artist.substr(0,1)
            this.letters[letter] = this.letters[letter] || {
                    artists : []
                }
            this.letters[letter].artists.push(a)
            this.artistsArray.push(a)
        }

        for (let letter in this.letters){

            // poulate array of letters
            this.artistLettersArray.push(letter)

            // sort artists in each letter, alphabetically
            this.letters[letter].artists.sort(songsHelper.sort)
        }

        // sort
        this.artistLettersArray.sort()
        this.artistsArray.sort(songsHelper.sort)
    }


    /**
     * Returns an array of all albums, derived from all songs
     */
    _albums() {
        let albumsHash = { }

        for (let s in this.songs){
            let song = this.songs[s],
                album = song.album.toLowerCase()

            if (!albumsHash[album])
                albumsHash[album] = {
                    name : song.album,
                    artist : song.artist,
                    songs : []
                }

            albumsHash[song.album.toLowerCase()].songs.push(song)
        }

        // convert to array. use this to remove albums with no songs
        for(let album in albumsHash){
            let a = albumsHash[album]
            if (a.songs.length === 0)
                continue

            this.albumsArray.push(a)
        }

        // sort
        this.albumsArray.sort(songsHelper.sort)

        return this.albumsArray
    }
}
