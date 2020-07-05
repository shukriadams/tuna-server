import React from 'react'
import history from './../history/history'
import { PROFILE } from './../routes/routes'
import contentHelper from './../helpers/contentHelper'

class View extends React.Component {

    async componentDidMount(){
        await contentHelper.fetchSession()
        history.push(`/${PROFILE}`)
    }

    render(){
        return (
            <div className="reload">
                Hang on, fetching data ...
            </div>
        )
    }
}

export { View }