import React, { Fragment } from 'react'

class View extends React.Component {
    render(){
        return(
            <Fragment>
                <p>
                    form doesn't have an outer wrapper element, it consists of form-row elements which give it basic structure
                </p>

                <div className="form-row">

                    <label className="form-label">
                        Labels describe fields
                    </label>

                    <div className="form-row">
                        <input className="form-textField" type="text" placeholder="This is a field"/>
                    </div>
                    <div className="form-row form-row--description">
                        this is a row under a field that describes the field
                    </div>
                </div>

                <div className="form-divider">
                    Dividers let us break the form up into visually-distinct sections
                </div>

                <div className="form-row">
                    <label className="form-label">
                        Label
                    </label>
                </div>

                <div className="form-row">
                    <input className="form-textField" type="text" placeholder="a field"/>
                </div>
                <div className="form-row form-row--description">
                    <span className="form-error">This is error text, it's just a span around text in the description row</span>
                </div>

                <hr className="form-divider" />

                <div className="form-row">
                    <label className="form-label">
                        Label
                    </label>
                </div>
                <div className="form-row">
                    <input className="form-textField" type="text" placeholder="a field"/>
                    <button className={`glu_button`}>Click me</button>
                </div>
                <div className="form-row form-row--description">
                    A button perfectly inline with a form element
                </div>

                <div className="form-row">
                    <label className="form-label">
                        A select element
                    </label>
                </div>

                <div className="form-row">
                    <select className="form-select">
                        <option>thing</option>
                    </select>
                    <button className={`glu_button`}>Click me</button>
                </div>


                <div className="form-row">
                    <ul className="form-infoblocks">
                        <li className="form-infoblock">
                            Some info blocks
                        </li>
                        <li className="form-infoblock">
                            these aren't done yet
                        </li>
                    </ul>
                </div>
            </Fragment>
         )
    }
}

export default View