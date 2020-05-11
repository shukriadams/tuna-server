import React from 'react'
import { connect } from 'react-redux'
import HomeAuthenticated from './homeAuthed'
import HomeAnonymous from './homeAnon'

class View extends React.Component {

    render(){
        let content = (<HomeAnonymous/>)
        if (this.props.isLoggedIn)
            content = (<HomeAuthenticated/>)

        return (
            <div className="home">
                {content}
            </div>
        )
    }
}

export default connect(

    state => {
        return {
            isLoggedIn: !!state.session.token
        }
    }

)(View)