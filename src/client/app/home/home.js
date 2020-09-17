import React from 'react'
import { connect } from 'react-redux'
import HomeAuthenticated from './homeAuthed'
import history from './../history/history'

class View extends React.Component {
    componentWillMount(){
        if (!this.props.isLoggedIn)
            history.push('/login')
    }

    render(){
        return (
            <div className="home">
                <HomeAuthenticated/>
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