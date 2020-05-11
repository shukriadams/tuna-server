import React from 'react';

class View extends React.Component {

    constructor(props) {
        super(props);
    }

    clicked(){
        if (this.props.onClicked)
            this.props.onClicked();
    }

    render() {
        return (
            <div onClick={this.clicked.bind(this)} className={`glu_mask`}></div>
        )
    }
}

let Model = {
    // optional callback which can be attached by parent. Will be invoked if mask is clicked, egs
    // if you declare the mask as such : the parent function callbeback will be triggered on click
    // <GluMask onClicked={this.callmeback.bind(this)}>
    onClicked : null
};

View.defaultProps = Model;

export { View, Model };