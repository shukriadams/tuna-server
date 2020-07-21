import React, { Fragment } from 'react'
import { connect } from 'react-redux'

class View extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {

        }
    }


    render(){
        return (
            <div className="playlist">
                {this.props.id}
            </div>
        )
    }
}

export default connect(
    (state)=>{
        return {

        }
    }
)(View)