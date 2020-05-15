import React, { Fragment } from 'react'
import history from './../history/history'
import Ajax from './../ajax/ajax'
import appSettings from './../appSettings/appSettings'
import { clearSession } from './../actions/actions'
import { Link } from 'react-router-dom'
import vc from 'vcjs'

export default class View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            missingKey : false,
            deleteError : null
        }
    }

    componentWillMount(){
        let key = vc.getQueryString('key')
        if (!key)
            this.setState( { missingKey : true } )
    }

    deleteAccount(){
        let ajax = new Ajax(),
            key = vc.getQueryString('key'),
            url  = `${appSettings.serverUrl}/v1/profile/delete?key=${key}`

        ajax.auth(url, response => {
            if (!response.code) {

                // log user out
                clearSession()

                // redirect to confirmation page

                history.push('/deleted')
            } else
                this.setState({ deleteError : response.message })
        })
    }

    render(){
        return(
            <div className="deleteProfile">
                <h1>Delete account</h1>

                {
                    this.state.missingKey &&
                    <p>
                        Invalid key. Please go to your <Link to="/profile">profile</Link> page and follow the delete instructions there.
                    </p>
                }

                {
                    !this.state.missingKey &&
                    <Fragment>
                        <p>
                            This is it - when you click the button below, your account will be permanently deleted. If you want to stay with us, just walk away and
                            no one will ever talk about this again.
                        </p>
                        <p>
                            <button onClick={this.deleteAccount.bind(this)} className={`glu_button`}>Yes, delete my account</button>
                        </p>

                        {
                            this.state.deleteError &&
                                <div>{this.state.deleteError}</div>
                        }
                    </Fragment>
                }

            </div>
        )
    }
}