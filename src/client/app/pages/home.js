import React from 'react'
import Layout from './../layout/layout'
import Home from './../home/home'
import { nowLayoutLarge, nowLayoutSmall } from './../actions/actions'
import { connect } from 'react-redux'

class View extends React.Component {

    componentWillMount(){
        if (this.props.isLoggedIn)
            nowLayoutLarge()
        else
            nowLayoutSmall()
    }

    render(){
        return (
            <Layout>
                <Home />
            </Layout>
        )
    }
}


export default connect(
     (state) => {
        return {
            isLoggedIn: !!state.session.token
        }
    }
)(View)