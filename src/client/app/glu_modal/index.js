import React, { Fragment } from 'react';
import classNames from 'classnames';
import { View as GluMask } from './../glu_mask/index';
import gluNoScroll from './../glu_noScroll/index';
import ReactSVG from 'react-svg';

class View extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            show: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show : nextProps.show })
    }

    close(){
        this.setState({ show : false})

        if (this.props.onClose)
            this.props.onClose()
    }

    onMaskClicked(){
        if (this.props.closeOnOffClick)
            this.close();
    }

    render(){
        let moduleClassNames = {};
        moduleClassNames[`glu_modal--show`] = this.state.show;
        gluNoScroll.toggle(this.state.show === true);

        return (

            <div className={classNames(`glu_modal`, moduleClassNames )}>
                {
                    this.props.show &&
                        <Fragment>
                            <GluMask onClicked={this.onMaskClicked.bind(this)} show={this.state.show} />
                            {
                                this.props.closeSVG &&
                                    <a href="javascript:void(0)" onClick={this.close.bind(this)}>
                                        <ReactSVG path={this.props.closeSVG} className={`glu_modal-close`} />
                                    </a>
                            }

                            <div className={`glu_modal-inner`}>
                                {/* Add optional header content - this will not scroll with regular child content*/}
                                {this.props.header}

                                <div className={`glu_modal-content`}>
                                    {this.props.children}
                                </div>
                            </div>
                        </Fragment>
                }
            </div>
        )
    }
}

let Model = {

    closeOnOffClick : true,

    //
    show: false,

    // path to close icon SVG
    closeSVG : null,

    // optional callback, called when modal is closed.
    onClose: null
};

View.defaultProps = Model;

export { View, Model };

