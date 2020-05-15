/**
 * Presents an album on a list.
 */
import React from 'react'

class View extends React.Component {

    render(){
        return (
            <div className="listAlbum">
                {this.props.text}
            </div>
        )
    }
}

export { View }