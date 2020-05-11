import React from 'react';
import pguid from 'pguid';
import ClassNames from 'classnames';

class View extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isChecked : false,
            uid : this.props.uid || pguid()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ isChecked : nextProps.isChecked });
    }

    componentWillMount() {
        this.setState({ isChecked : this.props.isChecked });
    }

    onChanged(e){
        let newCheckedValue = !this.state.isChecked;

        if (this.props.onChanged){
            let allowChange = this.props.onChanged(newCheckedValue, e);
            if (allowChange === false)
                newCheckedValue = !newCheckedValue;
        }

        this.setState({ isChecked : newCheckedValue});
    }

    render(){
        let moduleClassNames = {};
        moduleClassNames[`glu_slidingCheckbox--selected`] = this.state.isChecked;

        return (
            <div className={ClassNames(`glu_slidingCheckbox`, moduleClassNames)} onClick={this.onChanged.bind(this)}>
                <div className={`glu_slidingCheckbox-label`}></div>
            </div>
        );
    }
}
let Model = {
    uid : null,
    isChecked : true,
    onChanged : null
};

View.defaultProps = Model;

export { View, Model };