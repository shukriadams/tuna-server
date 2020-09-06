import React from 'react';
import { View as GluModal } from './../glu_modal/index';

class View extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            show : false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show : nextProps.show });
    }

    onReject(){
        if (this.props.onReject)
            this.props.onReject()

        this.setState({ show : false })
    }

    onAccept(){
        if (this.props.onAccept)
            this.props.onAccept()

        this.setState({ show : false })
    }

    render(){
        return (
            <div className={`glu_confirmModal`}>
                <GluModal closeOnOffClick={true} show={this.state.show} onClick={this.props.click}>
                    <div className={`glu_confirmModal-message`}>
                        {this.props.children}
                    </div>
                    <div className={`glu_confirmModal-buttons`}>
                        {
                            this.props.reject &&
                               <button className={`glu_button`} onClick={this.onReject.bind(this) } >{this.props.reject}</button>
                        }

                        {
                            this.props.confirm &&
                                <button className={`glu_button`} onClick={this.onAccept.bind(this) } >{this.props.confirm}</button>
                        }
                    </div>
                </GluModal>
            </div>
        )
    }
}

let Model = {
    // callback
    onReject: null,

    onAccept : null,

    // set to null to hide
    confirm : 'Yes',

    // set to null to hide
    reject: 'No',

    //
    show: false,

    // path to close icon SVG
    closeSVG : null,

    // optional callback, called when modal is closed.
    onClose: null
};

View.defaultProps = Model;

export { View, Model };
