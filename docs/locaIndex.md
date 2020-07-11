# Tuna Local Index

Tuna gives a you view of the music files you have available by using their ID3 tags to generate lists, tree views etc. It cannot easily get tag data by reading them directly from the remote source, say Nextcloud. To do that, it would have to download every music file, store them temporarily, and load the as binary data to parse out the ID3 tags. For large collections of music, this would be a massive bandwidth sink. 

To get around this problem, you the user are required to "pre-index" your music locally. You have to install and run the [Tuna Index](https://github.com/shukriadams/tuna-indexer), which scans your music locally and writes the index file locally at a fixed location in your NextCloud folder. The Tuna server then has to download only this file to get a full listing of all your music.

Of course, there are security concerns - I myself am loath to run apps on my system if I don't know exactly what they're doing. The full source of the indexer is available, but if you still don't trust it, you can easily roll your own indexer if you are this inclined.

## Index Format

There are two index files.

### Status

_.tuna.json_ has the following structure

    {
        "hash": "8e1055162fdcd3af983d0a94862f489f",
        "date" :1593641919402
    }

- Hash is the combined hash of all your music files. This isn't strictly generated - it's carried all the way up to the player client so it knows if songs have changed and it needs to auto-pull latest. Hash all your music files, concatenate them all and then hash the final string.
- Date - the last time your files have changed, in milliseconds.

### Main Index

_.tuna.dat_ is a text file. Each line of the file is a seperate entry, and each line is valid JSON data on its own. That is to say, each line can be parsed into its own JSON object. This is for performance - we can walk through the index one line at a time without having to load and JSON parse it in its entirety.

The first line is always the same content as the .tuna.json - a hash and last change date of the music in the index.
Each subsequent line is an entry for a music file, with the following properties :

- album : string. Album name from ID3 tag.
- artist : string. Artist/band from ID3 tag 
- name ": string. Song name from ID3 tag.
- path : string. Path of the song relative to the NextCloud/Dropbox folder it is in. If your music file is @ c:/Dropbox/mymusic/song.mp3 and your Dropbox folder is c:/Dropbox, then path will be "/mymusic/song.mp3". Paths are exactly as your OS sees them - they can contain spaces and whatever characters your OS filesystem allows.
- year : integer, song year from ID3 tag. Optional.
- track : integer, track nr from ID3 tag. Optional. 
- genres : string, genres from ID3 tag. Optional. Use commas to separate multiple genre values

Properties can be in any order, and songs can be in any order.

