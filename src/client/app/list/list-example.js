/**
 *  Demo page with examples of different kinds of lists. No logic for the list is defined here, everything lives in the
 *  list view proper.
 *
 *  Note : this list assumes there are songs available in the system
 */
import React, { Fragment } from 'react'
import { Model, View as List } from './list'
import Store from './../store/store'
import SongHelper from './../songs/songsHelper'
import { connect } from 'react-redux'

class View extends React.Component {
    render(){
        let lastRandomPosition = 0,
            state = Store.getState(),
            songs = state.session.songs

        function getRandomSong(){
            lastRandomPosition = Math.floor( Math.random()*songs.length / 10) + lastRandomPosition;
            if (lastRandomPosition > songs.length + 1)
                lastRandomPosition = 0

            return songs[lastRandomPosition]
        }

        // ghetto array randomizer. Not true random.
        class Randomizer{

            randomize(array, items){
                this.lastPosition = 0
                let results = []

                for (let i = 0 ; i < items; i ++){
                    this.lastPosition = Math.floor( Math.random()*array.length / 10) + this.lastPosition
                    if (this.lastPosition > array.length + 1)
                        this.lastPosition = 0

                    if (array[this.lastPosition])
                        results.push(array[this.lastPosition])
                }

                return results
            }
        }

        // set up a basic list
        let randomizer = new Randomizer(),
            basicList = new Model()

        basicList.items = randomizer.randomize(songs, 5)

        let scrollableList = new Model('mySearch')
        scrollableList.context = 'search'
        scrollableList.isScrollable = true
        scrollableList.items = randomizer.randomize(songs, 20)

        let flippedList = new Model('myQueue')
        flippedList.items = SongHelper.idsToObjects(this.props.queue.songs)
        flippedList.context = 'queue'

        let searchList =  new Model('mySearch')
        searchList.context = 'search'
        searchList.items = randomizer.randomize(songs, 10)

        return (
            <Fragment>
                <h2>Basic list (browse)</h2>
                <List {...basicList} />

                <h2>Flipped (queue)</h2>
                <List {...flippedList} />

                <h2>Scrolling</h2>
                <div className="listDemo-smallContainer">
                    <List {...scrollableList} />
                </div>

                <h2>Search results</h2>
                <List {...searchList} />
            </Fragment>
        )
    }
}

// redux mapping
export default connect(
    (state) => {
        return {
            queue : state.queue
        }
    }
)(View)